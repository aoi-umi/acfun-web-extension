
import * as config from './config'
let prefix = `${config.prefix}-live-`;
let acceptBtnName = `${prefix}accept`;
let cancelBtnName = `${prefix}cancel`;
let timeInputName = `${prefix}time`;
let dialogName = `${prefix}dialog`;
let head = document.querySelector('head');
let body = document.querySelector('body');
let defaultTime = 100;
let likeBtn = document.querySelector<HTMLButtonElement>('.like-heart');
export class AcLiveExt {
  dialog: HTMLDivElement
  acLike: number
  inited = false
  get acLikeExt() {
    return window.acLikeExt
  }
  constructor() { }
  
  static globalInit() {
    let acLikeExt = window.acLikeExt;
    if (!acLikeExt)
      acLikeExt = window.acLikeExt = new AcLiveExt();
    acLikeExt.init();
  }
  
  toggle(dom, show?) {
    if (show === undefined)
      show = !(dom.style.display !== 'none')
    dom.style.display = !show ? 'none' : ''
  }

  // 样式
  initStyle() {
    let style = document.createElement('style');
    style.innerHTML = `
      .${prefix}menu {
        background: white;
        position: fixed; top: 100px; right: 10px;
        border-radius: 50%; border: 1px solid #dcdee2;
        width: 40px; height: 40px;
        z-index: 1000;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .${prefix}dialog-box {
        position: fixed; top: 100px; right: 10px;
        display: flex; justify-content: center;
        z-index: 1000;
      }
      .${prefix}dialog {
        background: white; width: 250px; height:100px; 
        border: 1px solid #dcdee2; border-radius: 5px;
        padding: 10px;
      }
      
      .${prefix}dialog > * {
        margin-bottom: 5px;
      }
      .${prefix}input {
        background-color: #f8f8f8 !important;
        color: #333;
        border-radius: 5px;
        padding: 2px 10px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        line-height: 20px;
        border: 0;
      }
      .${prefix}btn {
        box-sizing: border-box;
        height: 28px;
        border-radius: 4px;
        padding: 3px 10px;
        font-size: 14px;
        line-height: 14px;
        cursor: pointer;
        position: relative;
        display: inline-flex;
        align-items: center;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        background-image: none;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        color: #999;
      }
      .${prefix}btn-primary {
        background: #fd4c5d;
        color: #fff;
      }
    `;
    head.appendChild(style);
  }

  initView() {
    this.addMenu();
    this.addDialog();
  };

  addMenu() {
    let dom: any = document.createElement('div');
    dom.classList = [
      `${prefix}menu`
    ];
    dom.innerHTML = `
    <svg width="20" viewBox="0 0 70 60">
      <path d="M0 10 L10 10 L10 0 L30 0 L30 10 L40 10 L40 0 L60 0 L60 10 L70 10 L70 30 L60 30 L60 40 L50 40 L50 50 L40 50 L40 60 L30 60 L30 50 L20 50 L20 40 L10 40 L10 30 L0 30 Z" fill="red" fill-rule="evenodd" />
    </svg>
    `;
    dom.addEventListener('click', () => {
      this.acLikeExt.run()
    })
    body.appendChild(dom)
  }

  addDialog() {
    let dialogHtml = `
      <div class="${prefix}dialog">
        <div>时间(毫秒/次, 大于等于100的数)</div>
        <div>
          <input class="${prefix}input" id="${timeInputName}" value=${defaultTime} autocomplete="off"  type="text" /> 
        </div>
        <div>
          <button id="${cancelBtnName}" type="button" class="${prefix}btn">取消</button>
          <button id="${acceptBtnName}" type="button" class="${prefix}btn ${prefix}btn-primary" >确定</button>
        </div>
      </div>`;
    let dialog: any = this.dialog = document.createElement("div");
    dialog.id = dialogName
    dialog.classList = [
      `${prefix}dialog-box`
    ];
    dialog.innerHTML = dialogHtml;
    this.toggle(dialog, false);
    let acceptBtn = dialog.querySelector(`#${acceptBtnName}`)
    acceptBtn.addEventListener('click', () => {
      this.acceptClick();
    });
    let cancelBtn = dialog.querySelector(`#${cancelBtnName}`)
    cancelBtn.addEventListener('click', () => {
      this.toggle(dialog);
    });
    body.appendChild(dialog);
    this.acLikeExt.dialog = dialog
  }

  acceptClick() {
    let dialog = this.acLikeExt.dialog;
    let time: any = dialog.querySelector<HTMLInputElement>(`#${timeInputName}`).value;
    time = new Number(time);
    if (isNaN(time) || time < 100) {
      return alert('请输入正确的时间')
    }
    this.toggle(dialog);
    this.toggleLike(time);
  }

  toggleLike(time?) {
    if (!likeBtn)
      return alert('当前页面不支持');
    if (this.acLikeExt.acLike) {
      console.log('停止点赞')
      clearInterval(this.acLikeExt.acLike);
      this.acLikeExt.acLike = 0;
    } else {
      console.log('开始点赞')
      this.acLikeExt.acLike = setInterval(function () {
        likeBtn.click();
      }, time);
    }
  }

  init() {
    if (this.acLikeExt.inited) return;
    this.initStyle();
    this.initView();
    this.inited = true;
  }

  run() {
    // 运行中，停止
    if (this.acLikeExt.acLike) {
      this.toggleLike()
    } else {
      let dialog = this.acLikeExt.dialog;
      this.toggle(dialog, true);
    }
  };
}