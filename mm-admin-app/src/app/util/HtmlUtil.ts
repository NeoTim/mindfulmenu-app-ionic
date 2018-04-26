import * as $ from 'jquery';

export class HtmlUtil {

  public static disableButtons() {
    return $('html button:not([disabled])').prop('disabled', true);
  }

  public static enableButtons(buttonElements: any) {
    buttonElements.prop('disabled', false);
  }

  public static scrollToTop(selector, animated) {
    if (selector) {
      if (selector.length > 0) {
        setTimeout(function () {
          if (animated) {
            selector.animate({scrollTop: 0}, 500);
          }
          else {
            selector.scrollTop(0);
          }
        });
      }
      else {
        setTimeout(function () {
          HtmlUtil.scrollToTop(selector, animated);
        });
      }
    }
    else {
      setTimeout(function () {
        const bodySelector = $('html, body');

        if (animated) {
          bodySelector.animate({scrollTop: 0}, 500);
        }
        else {
          bodySelector.scrollTop(0);
        }

      });
    }
  }

  public static scrollToBottom(selector, animated) {
    if (selector) {
      if (selector.length > 0) {
        setTimeout(function () {
          if (animated) {
            selector.animate({scrollTop: selector.prop('scrollHeight')}, 500);
          }
          else {
            selector.scrollTop(selector.prop('scrollHeight'));
          }
        });
      }
      else {
        setTimeout(function () {
          HtmlUtil.scrollToTop(selector, animated);
        });
      }
    }
    else {
      setTimeout(function () {
        const bodySelector = $('html, body');

        if (animated) {
          bodySelector.animate({scrollTop: bodySelector.prop('scrollHeight')}, 500);
        }
        else {
          bodySelector.scrollTop(bodySelector.prop('scrollHeight'));
        }

      });
    }
  }

  public static scrollToSelector(selector, parentSelector, animated) {
    if (selector) {
        if (parentSelector && (parentSelector.length > 0)) {
            if (selector.length > 0) {
                setTimeout(function () {
                    if (animated) {
                        parentSelector.animate({ scrollTop: selector.offset().top }, 500);
                    }
                    else {
                        selector.scrollTop(selector.offset().top);
                    }
                });
            }
            else {
                setTimeout(function () {
                    HtmlUtil.scrollToSelector(selector, parentSelector, animated);
                });
            }
        }
        else {
            setTimeout(function () {
                const bodySelector = $('html, body');

                if (animated) {
                    bodySelector.animate({ scrollTop: selector.offset().top }, 500);
                }
                else {
                    bodySelector.scrollTop(selector.offset().top);
                }

            });
        }
    }
  }
}
