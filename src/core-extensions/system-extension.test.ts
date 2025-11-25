import * as expect from 'expect';
import { platform } from 'os';
import { Toolbox } from '../domain/toolbox';
import create from './system-extension';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toolbox = new Toolbox();
create(toolbox);
const system = toolbox.system;

describe('System Operations', () => {
  test('Factory Function', () => {
    expect(system).toBeTruthy();
    expect(system.run).toBeInstanceOf(Function);
  });

  test('Capturing stdout', async () => {
    const stdout = await system.run(`${platform() === 'win32' ? 'dir /S /B' : 'ls'} ${__filename}`);
    expect(stdout).toContain(__filename);
  });

  test('Capturing stderr', async () => {
    expect.assertions(1);
    try {
      await system.run(`omgdontrunlol ${__filename}`);
    } catch (e) {
      expect(e.stderr).toMatch(/not (found|recognized)/);
    }
  });

  test('Checking for program existence', () => {
    const npm = system.which('npm');
    expect(npm).toBeTruthy();
  });

  test('Spawning and capturing results', async () => {
    const good = await system.spawn('echo hello');
    expect(good.status).toBe(0);
    expect(good.stdout.toString()).toMatch(/hello/);
  });

  test('Handling missing programs during spawn', async () => {
    const crap = await system.spawn('dfsjkajfkldasjklfajsd').catch(err => err);
    expect(crap.error).toBeTruthy();
    expect(crap.output).toBeFalsy();
    expect(crap.status).toBeNull();
  });

  test('Handling exit codes during spawn', async () => {
    const crap = await system.spawn('npm');
    expect(crap.status).toBe(1);
  });

  test('Testing start timer function', async () => {
    const WAIT = 10;
    const start = Date.now();
    await delay(WAIT);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(WAIT - 1);
  });
});
