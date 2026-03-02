import { expect } from '@wdio/globals';

describe('Script Execution', () => {
    it('should execute sync script', async () => {
        const result = await browser.execute('return 1 + 1');
        expect(result).toBe(2);
    });

    it('should execute script with args', async () => {
        const result = await browser.execute((a, b) => a + b, 10, 20);
        expect(result).toBe(30);
    });

    it('should execute script accessing DOM', async () => {
        const title = await browser.execute(() => document.title);
        expect(title).toBe('WebDriver Test App');
    });

    it('should execute async script', async () => {
        const result = await browser.executeAsync((done) => {
            setTimeout(() => done(42), 100);
        });
        expect(result).toBe(42);
    });

    it('should resolve W3C element references passed as script args', async () => {
        // This is the core regression test: WebdriverIO passes element objects
        // to browser.execute() which must be resolved to real DOM nodes.
        const heading = await $('h1');
        const text = await browser.execute((el) => el.textContent, heading);
        expect(text).toBe('WebDriver Test App');
    });

    it('should resolve element refs in async scripts', async () => {
        const heading = await $('h1');
        const text = await browser.executeAsync((el, done) => {
            done(el.textContent);
        }, heading);
        expect(text).toBe('WebDriver Test App');
    });

    it('should support isDisplayed on elements', async () => {
        // isDisplayed() internally calls browser.execute(isElementDisplayed, this)
        // which was the original failing case.
        const heading = await $('h1');
        expect(await heading.isDisplayed()).toBe(true);
    });
});
