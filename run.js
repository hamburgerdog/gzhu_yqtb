const puppeteer = require('puppeteer');

const infos = process.argv.slice(2);
if (infos.length !== 2) throw new Error('输入信息不正确，请重新输入格式为： [id] [password]');
if (!infos[0].match(/^\d{10}$/)) throw new Error('ID格式不正确');
if (infos[1].length < 6 || infos[1].length > 18) throw new Error('密码格式不正确');
const [id, password] = infos;

const PAGE_TIMEOUT = 60 * 1000;
const COMMON_TIMEOUT = 5 * 1000;
const LOGIN_PATH = "http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start?back=1&x_posted=true";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT);
  page.setDefaultNavigationTimeout(PAGE_TIMEOUT);
  await page.goto(LOGIN_PATH, {
    waitUntil: 'networkidle2'
  });
  await page.waitForSelector("#un");
  await page.type("#un", id);
  await page.keyboard.down('Tab');
  await page.keyboard.type(password);
  await Promise.all([page.click("#index_login_btn"), page.waitForNavigation()]);
  //  避免.waitForSelector()不生效才用的.waitForTimeout()
  //  暂停是为了等待页面加载
  await page.waitForTimeout(COMMON_TIMEOUT);
  await page.waitForSelector("#preview_start_button");
  await Promise.all([page.click("#preview_start_button"), page.waitForNavigation()]);
  await page.waitForTimeout(COMMON_TIMEOUT);
  await page.waitForSelector("#V1_CTRL46");
  await page.click("#V1_CTRL46");
  await page.click("#V1_CTRL262");
  await page.click("#V1_CTRL37");
  await page.click("#V1_CTRL82");
  await Promise.all([page.click(".command_button_content"), page.waitForTimeout(COMMON_TIMEOUT * 2)]);
  browser.close();
})();