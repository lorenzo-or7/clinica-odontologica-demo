/**
 * Testes de ponta a ponta usando o Chrome/Edge instalado (playwright-core, sem download de navegador).
 *
 *   npm run build && npm run preview -- --port 4173   (em outro terminal)
 *   npm run test:e2e                                  (BASE_URL opcional, padrão http://localhost:4173)
 *   SHOTS=1 npm run test:e2e                          (salva capturas em ./test-results)
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const SHOTS = Boolean(process.env.SHOTS);
const outDir = path.resolve('test-results');
if (SHOTS) fs.mkdirSync(outDir, { recursive: true });

const executablePath = [
  process.env.BROWSER_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]
  .filter(Boolean)
  .find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error('Nenhum Chrome/Edge encontrado. Defina BROWSER_PATH.');
  process.exit(2);
}

const results = [];
const check = (cond, name, info = '') => results.push({ ok: Boolean(cond), name, info });

const browser = await chromium.launch({ executablePath, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

// Avisos conhecidos de bibliotecas que não indicam falha do site.
const ignored = [/THREE\.Clock: This module has been deprecated/];

async function open(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    if (ignored.some((r) => r.test(m.text()))) return;
    errors.push(`${m.type()}: ${m.text()}`);
  });
  page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()}: ${r.url()}`));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  return { ctx, page, errors };
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.body.scrollHeight; y += 450) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await page.waitForTimeout(1200);
}

// ---------- Desktop: fluxo completo ----------
{
  const { ctx, page, errors } = await open({ width: 1440, height: 900 });

  check((await page.locator('h1').innerText()).includes('naturalmente'), 'hero: headline presente');
  check(await page.locator('nav[aria-label="Principal"] a[href="#tratamentos"]').isVisible(), 'navbar: links visíveis no desktop');

  // Imagens
  await scrollThrough(page);
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  check(broken.length === 0, 'imagens: nenhuma quebrada', broken.join(', '));

  // 3D
  await page.locator('#escultura').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(2500);
  check((await page.locator('#escultura canvas').count()) === 1, 'escultura: canvas WebGL montado');

  // Navegação por âncora + seção ativa
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.click('nav[aria-label="Principal"] a[href="#especialistas"]');
  await page.waitForTimeout(1500);
  const top = await page.evaluate(() => document.getElementById('especialistas').getBoundingClientRect().top);
  check(Math.abs(top) < 200, 'navbar: âncora rola até Especialistas', `top=${top}`);
  await page.evaluate(() => window.scrollBy(0, -40));
  await page.waitForTimeout(600);
  check(
    (await page.locator('nav[aria-label="Principal"] a[aria-current="location"]').count()) === 1,
    'navbar: indica a seção ativa',
  );

  // Filtros do catálogo
  await page.locator('#tratamentos').scrollIntoViewIfNeeded();
  const rows = page.locator('#tratamentos li button[aria-expanded]');
  check((await rows.count()) === 6, 'tratamentos: 6 itens em "Todos"');
  await page.click('#tratamentos button[aria-pressed]:has-text("Estética")');
  await page.waitForTimeout(700);
  check((await rows.count()) === 3, 'tratamentos: filtro Estética mostra 3', String(await rows.count()));
  check((await page.locator('#tratamentos button[aria-pressed="true"]').innerText()) === 'Estética', 'tratamentos: filtro ativo marcado');
  await page.click('#tratamentos button[aria-pressed]:has-text("Saúde e prevenção")');
  await page.waitForTimeout(700);
  check((await rows.count()) === 1, 'tratamentos: filtro Saúde mostra 1');
  await page.click('#tratamentos button[aria-pressed]:has-text("Todos")');
  await page.waitForTimeout(700);

  // Expansão e teclado
  await rows.first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  check((await rows.first().getAttribute('aria-expanded')) === 'true', 'tratamentos: Enter expande o item');
  await page.keyboard.press('ArrowDown');
  const focusedName = await page.evaluate(() => document.activeElement?.textContent ?? '');
  check(focusedName.includes('Clareamento'), 'tratamentos: seta para baixo move o foco', focusedName.slice(0, 40));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  check((await page.locator('#tratamentos button[aria-expanded="true"]').count()) === 1, 'tratamentos: só um item aberto por vez');

  // CTA contextual abre o agendamento com o tratamento preenchido
  await page.click('#tratamentos button:has-text("Perguntar sobre")');
  await page.waitForTimeout(600);
  const dialog = page.locator('dialog[open]');
  check(await dialog.isVisible(), 'agendamento: CTA contextual abre o diálogo');
  check((await dialog.locator('select').inputValue()) === 'Clareamento dental', 'agendamento: assunto pré-selecionado');

  // Validação
  await dialog.locator('input[data-field="name"]').fill('');
  await dialog.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  check((await dialog.locator('[aria-invalid="true"]').count()) >= 1, 'agendamento: erros de validação exibidos');
  const focusedField = await page.evaluate(() => document.activeElement?.getAttribute('data-field'));
  check(focusedField === 'name', 'agendamento: foco vai ao primeiro campo inválido');

  // Estado demonstrativo (sem número configurado: nada é enviado)
  await dialog.locator('input[data-field="name"]').fill('Teste');
  await dialog.locator('label:has-text("Tarde")').click();
  const popups = [];
  page.on('popup', (p) => popups.push(p));
  await dialog.locator('button[type="submit"]').click();
  await page.waitForTimeout(500);
  check(await dialog.getByText('Demonstração concluída').isVisible(), 'agendamento: estado demonstrativo sem telefone');
  check(popups.length === 0, 'agendamento: nenhuma janela externa aberta');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  check((await page.locator('dialog[open]').count()) === 0, 'agendamento: Esc fecha o diálogo');

  // Visita guiada
  await page.locator('#experiencia').scrollIntoViewIfNeeded();
  await page.click('#experiencia button[aria-label="Próximo ambiente"] >> visible=true');
  await page.waitForTimeout(1200);
  check((await page.locator('#experiencia h3').first().innerText()).includes('Consultórios'), 'visita: próximo ambiente');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1200);
  check((await page.locator('#experiencia button[aria-current="true"]').getAttribute('aria-label')).startsWith('Tecnologia'), 'visita: seta do teclado avança e indica posição');

  // FAQ
  await page.locator('#duvidas').scrollIntoViewIfNeeded();
  const qs = page.locator('#duvidas button[aria-expanded]');
  check((await page.locator('#duvidas button[aria-expanded="true"]').count()) === 1, 'faq: começa com uma pergunta aberta');
  await qs.nth(2).click();
  await page.waitForTimeout(500);
  check((await page.locator('#duvidas button[aria-expanded="true"]').count()) === 1, 'faq: só uma pergunta aberta por vez');
  check((await qs.nth(2).getAttribute('aria-expanded')) === 'true', 'faq: abre a pergunta clicada');
  await page.click('#duvidas button:has-text("Fechar todas")');
  await page.waitForTimeout(500);
  check((await page.locator('#duvidas button[aria-expanded="true"]').count()) === 0, 'faq: fechar todas');

  // Tema com persistência
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('nav[aria-label="Principal"] button[aria-label*="tema"]');
  check((await page.getAttribute('html', 'data-theme')) === 'dark', 'tema: alterna para escuro');
  await page.reload({ waitUntil: 'networkidle' });
  check((await page.getAttribute('html', 'data-theme')) === 'dark', 'tema: persiste após recarregar');
  if (SHOTS) await page.screenshot({ path: path.join(outDir, 'desktop-dark.png') });

  // Links externos seguros
  const unsafe = await page.evaluate(() =>
    [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).length,
  );
  check(unsafe === 0, 'links externos com rel=noopener');

  check(errors.length === 0, 'console: sem erros no desktop', errors.join(' | '));
  await ctx.close();
}

// ---------- Larguras: overflow e alvos de toque ----------
for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
  const { ctx, page, errors } = await open({ width, height: width < 768 ? 800 : 900 });
  await scrollThrough(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 0, `${width}px: sem overflow horizontal`, `+${overflow}px`);
  if (width < 1024) {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, a[href]')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && s.visibility !== 'hidden' && !el.closest('.sr-only, .skip-link') && (r.height < 44 || r.width < 44);
        })
        .map((el) => (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)),
    );
    check(small.length === 0, `${width}px: alvos de toque ≥ 44px`, small.join(' | '));
  }
  if (width === 390) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('button[aria-label="Abrir menu"]');
    await page.waitForTimeout(800);
    check(await page.locator('#mobile-menu').isVisible(), '390px: menu móvel abre');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    check((await page.locator('#mobile-menu').count()) === 0, '390px: Esc fecha o menu móvel');
  }
  if (SHOTS) await page.screenshot({ path: path.join(outDir, `w${width}.png`), fullPage: false });
  check(errors.length === 0, `${width}px: console sem erros`, errors.join(' | '));
  await ctx.close();
}

// ---------- Movimento reduzido ----------
{
  const { ctx, page, errors } = await open({ width: 1280, height: 800 }, { reducedMotion: 'reduce' });
  await scrollThrough(page);
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('main h2, main h3, main p')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && Number(getComputedStyle(el).opacity) < 0.99 && !el.closest('[aria-hidden="true"]');
      }).length,
  );
  check(hidden === 0, 'reduced motion: textos visíveis sem animação', `${hidden} elementos transparentes`);
  const sticky = await page.evaluate(() => document.getElementById('escultura').offsetHeight / window.innerHeight);
  check(sticky < 2.5, 'reduced motion: escultura sem rolagem longa', sticky.toFixed(2));
  check(errors.length === 0, 'reduced motion: console sem erros', errors.join(' | '));
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name}${r.ok || !r.info ? '' : `  → ${r.info}`}`);
console.log(`\n${results.length - failed.length}/${results.length} verificações passaram.`);
process.exit(failed.length ? 1 : 0);
