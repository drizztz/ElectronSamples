const { app, BrowserWindow, Menu } = require('electron')

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // Edit menu
  template[1].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}



function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({ width: 800, height: 600 })

  // 然后加载应用的 index.html。
  win.loadFile('index.html')

  // 打开开发者工具
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

function isNumber(input) {
　　var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
　　if (!re.test(input)) {
　　　　return false;
　　}
  return true;
}


function getRateAndShortcutNumber( amount ) {
    if( amount < 36000) {
      return [0.03, 0];
    } else if( amount < 144000) {
      return [0.1, 2520];
    } else if( amount < 300000) {
      return [0.2, 16920];
    } else if( amount < 420000) {
      return [0.25, 31920];
    } else if( amount < 660000) {
      return [0.3, 52920];
    } else if( amount < 960000) {
      return [0.35, 85920];
    } else {
      return [0.45, 181920];
    }
}


function getSum(array) {
  var sum = 0;
  array.forEach( value => {
    sum += value;
  });
  return sum;
}



function caculate() {

  var salary = Number(document.getElementById("salary").value);
  // var baseNumber = document.getElementById("base_number").value;
  var deduction = 5000 + Number(document.getElementById("deductible_number").value);
  if(!isNumber(salary) || salary <= 0 || !isNumber(deduction) || deduction - 5000 <= 0) {
    alert("请输入正确的数字");
  }
  var taxArray = new Array(12);
  // alert("salary:" + salary);
  // alert("deduction:" + deduction);
  var netSalary = getNetSalary(salary, deduction);
  for(var index = 1; index <= 2; index ++) {
    var RateAndShortcutNumber = getRateAndShortcutNumber(netSalary * index);
    // alert("netSalary:" + netSalary);
    // alert("RateAndShortcutNumber:" + RateAndShortcutNumber);
    var taxOfCurrentMonth = netSalary * index * RateAndShortcutNumber[0] - RateAndShortcutNumber[1] - getSum(taxArray);
    taxArray[index-1] = taxOfCurrentMonth;
  }
  // alert(taxArray);
}

function getNetSalary (salary, deduction) {
  var baseNumber = 0;
  if (salary < 4279) {
    baseNumber = 4279;
  } else if (salary < 21396) {
    baseNumber = salary;
  } else {
    baseNumber = 21396;
  }
  // var netSalary = Number(salary) - Number(4500) - Number(deduction);
  var netSalary = Number(salary) - Number(baseNumber * 0.175) - Number(deduction);
  return netSalary;
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(menu)
  console.log(Menu.getApplicationMenu())

})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})
