import * as config from './config'
import { AcLiveExt } from './live';

const prefix = `${config.prefix}-main-`;
type ItemType = {
  text: string
  key: string;
  data: any
}
class Main {
  constructor() {
    this.init();
  }

  initStyle() {
    $('style').append(`
    .${prefix}context-menu {
      display: none;
      min-width: 100px;
      min-height: 20px;
      position: fixed;
      background: white;
      border-radius: 5px;
      z-index: 3;
      padding: 15px 15px;
      cursor: pointer;
      box-shadow: 1px 1px 5px #888888;
    }
    `)
  }

  initView() {
  }

  init() {
    this.initStyle();
    this.initView();
    // 直播
    if (/live\/[\d]+/.test(location.href)) {
      AcLiveExt.globalInit();
    }
    let that = this;

    $(document).on('click', `:not(.${prefix}context-menu)`, function () {
      that.getMenu().hide();
    })
    $(document).on('click', `.${prefix}context-menu-item`, function (e) {
      let dom = $(this);
      let item = dom.data('item');
      that.handleMenuItem(item);
    })

    // 查看头像
    $(document).on('contextmenu', function (e) {
      let dom = $(e.target)
      // console.log(dom)
      let list = [{
        // 直播up主
        selector: '.live-author-avatar',
        getUrl: (dom) => {
          return dom.find('.live-author-avatar-img').attr('src')
        }
      }, {
        // 榜单
        selector: '.avatar',
        getUrl: (dom) => {
          return dom.find('.head-img').attr('src');
        }
      }, {
        // 主页
        selector: '.container-cover',
        getUrl: (dom) => {
          let url = dom.find('.user-photo').css('background-image');
          // 格式为url("......")
          url = url.substring(5, url.length - 2);
          return url;
        }
      }, {
        // 稿件up
        selector: '.up-avatar',
        getUrl: (dom) => {
          return dom.find('.avatar').attr('src');
        }
      }, {
        // 评论
        selector: '.area-comment-left .thumb',
        getUrl: (dom) => {
          return dom.find('.avatar').attr('src');
        }
      }, {
        // 盖楼评论
        selector: '.mci-avatar',
        getUrl: (dom) => {
          return dom.find('img.fc-avatar').attr('src');
        }
      }, {
        // 我的消息
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

  showContextMenu(opt: {
    e: JQuery.ContextMenuEvent,
    avatar?: string
  }) {
    let { e, avatar } = opt
    let pos = {
      x: e.originalEvent.x || 0,
      y: e.originalEvent.y || 0,
    }
    let list = [];
    if (avatar) {
      list.push({
        text: '查看头像',
        key: 'openImg',
        data: avatar
      })
    }
    this.createMenu(list, pos);
  }

  getMenu() {
    let menu = $(`.${prefix}context-menu`);
    if (!menu.length) {
      menu = $(`<div class="${prefix}context-menu"></div>`)
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
    switch (item.key) {
      case 'openImg':
        window.open(item.data, '__blank');
        break;
    }
  }
}

new Main();