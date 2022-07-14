
import * as config from './config'
import * as utils from './utils'
let prefix = `${config.prefix}-live-`;
let acceptBtnName = `${prefix}accept`;
let cancelBtnName = `${prefix}cancel`;
let timeInputName = `${prefix}time`;
let dialogName = `${prefix}dialog`;
let emojiName = `${prefix}emoji`;
let defaultTime = 100;
let likeBtn = document.querySelector<HTMLButtonElement>('.like-heart');
export class AcLiveExt {
  dialog: JQuery<HTMLElement>
  acLike: number
  get acLikeExt() {
    return window.acLiveExt
  }
  get acMainExt() {
    return window.acMainExt
  }
  constructor() { }

  static globalInit() {
    let acLikeExt = window.acLiveExt = new AcLiveExt();
    acLikeExt.init();
  }

  toggle(dom: JQuery<HTMLElement>, show?) {
    if (show === undefined)
      dom.toggle();
    else
      show ? dom.show() : dom.hide();
  }

  // 样式
  initStyle() {
    let style = $('<style></style>').text(`
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
    `);
    $('head').append(style)
  }

  async initView() {
    // 等待加载
    while (true) {
      await utils.wait(1000)
      let face = $('.face-text')
      if (face) break;
    }
    this.addDialog();
    this.addEmoji();
  }

  addDialog() {
    let dialog = $(`
      <div id="${dialogName}" class="${prefix}dialog-box">
        <div  class="${prefix}dialog">
          <div>时间(毫秒/次, 大于等于100的数)</div>
          <div>
            <input class="${prefix}input" id="${timeInputName}" value=${defaultTime} autocomplete="off"  type="text" /> 
          </div>
          <div>
            <button id="${cancelBtnName}" type="button" class="${prefix}btn">取消</button>
            <button id="${acceptBtnName}" type="button" class="${prefix}btn ${prefix}btn-primary" >确定</button>
          </div>
        </div>
      </div>`);

    this.toggle(dialog, false);
    let acceptBtn = dialog.find(`#${acceptBtnName}`)
    acceptBtn.on('click', () => {
      this.acceptClick();
    });
    let cancelBtn = dialog.find(`#${cancelBtnName}`)
    cancelBtn.on('click', () => {
      this.toggle(dialog);
    });
    $('body').append(dialog);
    this.acLikeExt.dialog = dialog
  }

  async addEmoji() {
    let face = $('.face-text')
    let that = this
    face.css({ display: 'flex', 'align-items': 'center' })
    let emoji = $(`<div class="${emojiName}" style="margin-left: 10px; cursor: pointer;">emoji</div>`)
    emoji.on('click', function (e) {
      that.acMainExt.showEmojiMenu({
        e
      })
      return false
    })
    face.find('span').after(emoji)
  }

  acceptClick() {
    let dialog = this.acLikeExt.dialog;
    let time: any = dialog.find(`#${timeInputName}`).attr('value');
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
        if (window.acMainExt.shouldPause) return
        likeBtn.click();
      }, time);
    }
  }

  init() {
    this.initStyle();
    this.initView();
  }

  run() {
    // 运行中，停止
    if (this.acLikeExt.acLike) {
      this.toggleLike()
    } else {
      let dialog = this.acLikeExt.dialog;
      this.toggle(dialog, true);
    }
  }
}