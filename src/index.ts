import * as config from './config'
import { AcLiveExt } from './live';
import * as utils from './utils'
const acfunHost = 'https://www.acfun.cn'
const prefix = `${config.prefix}-main-`;
type ItemType = {
  text: string
  key: string;
  data: any
}


let floatMenuName = `${prefix}float-menu`
let defaultMenuName = `${prefix}default-menu`
let contextMenuName = `${prefix}context-menu`
let emojiMenuName = `${prefix}emoji-menu`
let emojiMenuMainName = `${prefix}emoji-menu-main`
let emojiItemName = `${prefix}emoji-item`
let transparentName = `${prefix}tp`
export class AcMainExt {
  constructor() {
    this.init();
  }

  initStyle() {
    let style = $('<style></style>').text(`
    .${transparentName} {
      background: transparent;
    }
    .${floatMenuName} {
      display: none;
      min-width: 100px;
      min-height: 20px;
      position: fixed;
      z-index: 3;
    }
    .${defaultMenuName} {
      background: white;
      padding: 15px 15px;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 1px 1px 5px #888888;
    }
    .${contextMenuName} {
    }
    .${contextMenuName} > * {
      padding: 5px 0;
    }
    .${emojiMenuName} {
    }
    .${emojiMenuMainName} {
      width: 260px;
      max-height: 150px;
      overflow-y: auto;
      font-size: 16px;
    }
    .${emojiItemName} {
      display: inline-block;
      padding: 2px;
      text-align: center;
      width: 25px;
      height: 25px;
    }
    .${emojiItemName}:hover {
      background-color: #f5f5f5;
    }
    
    .${prefix}menu {
      position: fixed; top: 100px; right: 10px;
    }
    .${prefix}menu > * {
      margin-bottom: 10px;
    }
    .${prefix}menu-item {
      background: white;
      border-radius: 50%; border: 1px solid #dcdee2;
      width: 40px; height: 40px;
      z-index: 1000;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      animation:${prefix}show 1s;
    }
    .${prefix}hide {
      display: none;
    }
    @keyframes ${prefix}show {
      from {opacity:0;}
      to {opacity:1;}
    }
    `)
    $('head').append(style)
  }

  get isLive() {
    return /live\/[\d]+/.test(location.href)
  }

  get shouldPause() {
    return $(`.${floatMenuName}`).is(`:visible`)
      || $(`.${prefix}menu-sub-item`).is(`:visible`)
      // ??????
      || $('.container-gifts').hasClass('unfold')
      // ????????????
      || !$('.medal-panel-wrapper').hasClass('hide');
  }
  initView() {
    this.addMenu();
  }
  addMenu() {
    let dom = $(`<div class="${prefix}menu"></div>`);
    let items: JQuery<HTMLElement>[] = [];
    // ??????
    if (this.isLive) {
      let liveBtn = $(`
      <svg width="20" viewBox="0 0 70 60">
        <path d="M0 10 L10 10 L10 0 L30 0 L30 10 L40 10 L40 0 L60 0 L60 10 L70 10 L70 30 L60 30 L60 40 L50 40 L50 50 L40 50 L40 60 L30 60 L30 50 L20 50 L20 40 L10 40 L10 30 L0 30 Z" fill="red" fill-rule="evenodd" />
      </svg>
      `)
      liveBtn.on('click', () => {
        window.acLiveExt.run();
        return false;
      });
      items.push(liveBtn);
      AcLiveExt.globalInit();
    }
    // ?????????
    if (items.length > 1) {
      let mainMenuItem = $(`
      <svg viewBox="0 0 100 80" width="20" height="40">
        <rect width="100" height="20"></rect>
        <rect y="30" width="100" height="20"></rect>
        <rect y="60" width="100" height="20"></rect>
      </svg>
      `)

      mainMenuItem.on('click', () => {
        this.toggle($(`.${prefix}menu-sub-item`));
        return false;
      });
      $(document).on('click', () => {
        this.toggle($(`.${prefix}menu-sub-item`), false);
      })
      items.unshift(mainMenuItem);
    }

    if (items.length) {
      items = items.map((ele, idx) => {
        let dom = $('<div></div>');
        if (idx > 0) {
          dom.addClass(`${prefix}menu-sub-item`).addClass(`${prefix}hide`)
        }
        dom.addClass(`${prefix}menu-item`).append(ele);
        return dom;
      })
      dom.append(items);
      $('body').append(dom);
    }

  }

  init() {
    this.initStyle();
    this.initView();

    this.initAvatar();
    this.initDanmaku();
  }

  // ????????????
  initAvatar() {
    let that = this

    $(document).on('contextmenu', function (e) {
      let dom = $(e.target)
      // console.log(dom)
      let list = [{
        // ??????up???
        selector: '.live-author-avatar',
        getUrl: (dom) => {
          return dom.find('.live-author-avatar-img').attr('src')
        }
      }, {
        // ??????
        selector: '.avatar',
        getUrl: (dom) => {
          return dom.find('.head-img').attr('src');
        }
      }, {
        // ??????
        selector: '.container-cover',
        getUrl: (dom) => {
          let url = dom.find('.user-photo').css('background-image');
          // ?????????url("......")
          url = url.substring(5, url.length - 2);
          return url;
        }
      }, {
        // ??????up
        selector: '.up-avatar',
        getUrl: (dom) => {
          return dom.find('.avatar').attr('src');
        }
      }, {
        // ??????
        selector: '.area-comment-left .thumb',
        getUrl: (dom) => {
          return dom.find('.avatar').attr('src');
        }
      }, {
        // ????????????
        selector: '.mci-avatar',
        getUrl: (dom) => {
          return dom.find('img.fc-avatar').attr('src');
        }
      }, {
        // ????????????
        selector: '.avatar-section',
        getUrl: (dom) => {
          return dom.find('.avatar').attr('src');
        }
      },];
      for (let ele of list) {
        let matchedDom
        if (dom.is(ele.selector)) {
          matchedDom = dom;
        } else {
          let p = dom.parents(ele.selector)
          if (p.length)
            matchedDom = p
        }
        if (matchedDom) {
          let avatar = ele.getUrl(matchedDom);
          if (avatar) {
            avatar = avatar.split('?')[0]
            that.showContextMenu({
              e,
              avatar
            });
            return false;
          }
        }
      }
    });
  }

  // ??????
  initDanmaku() {
    let that = this

    $(document).on('contextmenu', '.comment', function (e) {
      let dom = $(this).find('.nickname');
      let danmaku = dom.data('comment')
      that.showContextMenu({
        e,
        danmaku
      })
      return false
    })

  }

  toggle(dom: JQuery<HTMLElement>, show?: boolean) {
    let hideCls = `${prefix}hide`;
    show = show ?? dom.hasClass(hideCls)
    if (show)
      dom.removeClass(hideCls)
    else
      dom.addClass(hideCls)
  }

  getClickPos(e: JQuery.ContextMenuEvent | JQuery.ClickEvent) {
    return {
      x: e.originalEvent.x || 0,
      y: e.originalEvent.y || 0,
    }
  }

  showContextMenu(opt: {
    e: JQuery.ContextMenuEvent,
    avatar?: string
    danmaku?: string
  }) {
    let { e, avatar, danmaku } = opt
    let pos = this.getClickPos(e)
    let list = [];
    if (avatar) {
      list.push({
        text: '????????????',
        key: 'openImg',
        data: avatar
      })
    }
    if (danmaku) {
      list.push({
        text: '????????????',
        key: 'copyDanmaku',
        data: danmaku
      });
      if (/^ac[\d]+/.test(danmaku)) {
        list.push({
          text: '????????????',
          key: 'openAcVideo',
          data: danmaku
        });
      }
      if (/^http/.test(danmaku)) {
        list.push({
          text: '????????????',
          key: 'openUrl',
          data: danmaku
        });
      }
    }
    this.createMenu(list, pos);
  }

  getMenu() {
    let that = this
    let menu = $(`.${contextMenuName}`);
    if (!menu.length) {
      $(document).on('click', function () {
        that.getMenu().hide();
      })

      $(document).on('click', `.${prefix}context-menu-item`, function (e) {
        let dom = $(this);
        let item = dom.data('item');
        that.handleMenuItem(item);
      })
      menu = $(`<div class="${contextMenuName} ${floatMenuName} ${defaultMenuName}"></div>`)
      $('body').append(menu)
    }
    return menu;
  }

  createMenu(item: ItemType[], pos) {
    let menu = this.getMenu();
    menu
      .css({
        left: pos.x + 'px',
        top: pos.y + 'px',
      })
      .empty()
      .append(item.map(ele => {
        let dom = $(`<div class="${prefix}context-menu-item">${ele.text}</div>`);
        dom.data('item', ele);
        return dom;
      })).show();
  }

  handleMenuItem(item: ItemType) {
    let url;
    switch (item.key) {
      case 'openImg':
      case 'openUrl':
        url = item.data;
        break;
      case 'openAcVideo':
        url = `${acfunHost}/v/${item.data}`
        break;
      case 'copyDanmaku':
        utils.clipboardCopy(item.data);
        break;
    }
    if (url) {
      window.open(url, '__blank');
    }
  }

  getEmojiMenu() {
    let that = this
    let menu = $(`.${emojiMenuName}`);
    if (!menu.length) {
      menu = $(`<div class="${emojiMenuName} ${floatMenuName} ${transparentName}"></div>`)
      let main = $(`<div class="${emojiMenuMainName} ${defaultMenuName}"></div>`)
      menu.append(main)
      menu.append(`<div class="${transparentName}" style="height: 30px"></div>`)
      /*
      emoji
      http://www.amp-what.com/unicode/search/emoticon
       */
      let list = [
        [9889, 129313, 129397, 128131, 127863],
        { from: 128512, to: 128591 },
        // ??????
        { from: 128045, to: 128060 },
      ]
      let arr = [];
      list.forEach(ele => {
        if (ele instanceof Array) {
          arr.push(...ele);
        } else {
          for (let i = ele.from; i <= ele.to; i++) {
            arr.push(i)
          }
        }
      })
      let doms = []
      arr.forEach(i => {
        let value = typeof i === 'string' ? i : `&#${i};`
        doms.push(`<div class="${emojiItemName}" data-value="${value}">${value}</div>`)
      });
      main.append(doms.join(''))
      $('body').append(menu)

      $(document).on('mouseleave', `.${emojiMenuName}`, function (e) {
        that.getEmojiMenu().hide();
      })
      let rangeIndex;
      let input = $('.live-feed-input .danmaku-input');
      input.on('blur', function (this: HTMLInputElement) {
        rangeIndex = this.selectionStart;
      })

      $(document).on('click', `.${emojiItemName}`, function () {
        let dom = $(this)
        let v = dom.data('value')
        utils.insert({
          input: input[0] as any,
          text: v,
          rangeIndex
        })
      })
    }
    return menu
  }

  showEmojiMenu(opt: {
    e: JQuery.ClickEvent
  }) {
    let { e, } = opt
    let pos = this.getClickPos(e)
    let menu = this.getEmojiMenu()

    menu
      .css({
        left: pos.x + 'px',
        top: (pos.y - menu.outerHeight() + 10) + 'px',
      }).show()
  }
}

window.acMainExt = new AcMainExt();