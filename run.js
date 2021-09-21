const puppeteer = require('puppeteer');

const infos = process.argv.slice(4);
if (infos.length % 2 !== 0) throw new Error('输入信息不正确，请重新输入格式为： [id] [password]');

infos.forEach((item, index) => {
  if (index % 2 === 0) {
    if (!item.match(/^\d{10}$/)) throw new Error('ID格式不正确');
  } else {
    if (item.length < 6 || item.length > 18) throw new Error('密码格式不正确');
  }
});

const PAGE_TIMEOUT = Number(process.argv[2]) * 1000;
const COMMON_TIMEOUT = Number(process.argv[3]) * 1000;
const LOGIN_PATH = "http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start?back=1&x_posted=true";

console.log(`页面超时时间为：${process.argv[2]?process.argv[2]:'♾️'} 秒\n等待时间为：\t${process.argv[3]} 秒`);

const login = async (id, password, browser) => {
  const page = await browser.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT);
  page.setDefaultNavigationTimeout(PAGE_TIMEOUT);
  await page.goto(LOGIN_PATH, {
    waitUntil: 'load',
    timeout: 0,
  });
  await page.waitForTimeout(COMMON_TIMEOUT);
  await page.waitForSelector("#un");
  await page.type("#un", id);
  await page.keyboard.down('Tab');
  await page.keyboard.type(password);
  await page.waitForSelector("#index_login_btn");
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
  await page.click(".command_button_content");
  // 等待页面提交
  await page.waitForTimeout(COMMON_TIMEOUT * 2)
};

const loginByInfos = async (infos) => {
  const browser = await puppeteer.launch();
  const taskQueue = [];
  for (let i = 0; i < infos.length; i += 2) {
    taskQueue.push(login(infos[i], infos[i + 1], browser));
  };
  await Promise.all(taskQueue);
  await browser.close();
};

loginByInfos(infos);