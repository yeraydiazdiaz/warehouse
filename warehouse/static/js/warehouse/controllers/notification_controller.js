/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["notification", "notificationDismiss"];

  /**
   * Get notification's id based on current DOM element id and version
   *
   * Notifications _without_ an element id and `notification-data-version`
   * will be treated as ephemeral: its dismissed state will not be persisted
   * into localStorage.
   *
   * @private
   */
  _getNotificationId() {
    /** Get data from `data-notification-version` attribute */
    const version = this.data.get("version") || "-1";
    if (this.notificationTarget.id) {
      return `${this.notificationTarget.id}_${version}__dismissed`;
    }
  }

  get isSticky() {
    return this.notificationTarget.parentNode.classList.contains("js-stick-to-top");
  }

  get shouldDisplay() {
    const notificationId = this._getNotificationId();
    const isDismissable = this.notificationTarget.classList.contains("notification-bar--dismissable");

    // Check if the target is dismissable, and if so:
    // * whether it has no notificationId (it's ephemeral)
    // * or it's not in localStorage (it hasn't been dismissed yet)
    return isDismissable && (!notificationId || !localStorage.getItem(notificationId));
  }

  initialize() {
    if (this.shouldDisplay) {
      this.notificationTarget.classList.add("notification-bar--visible");
    }
  }

  connect() {
    if (this.shouldDisplay && this.isSticky) {
      this._placeAtTop();
      window.addEventListener("resize", this._onResize);
    }
  }

  _onResize() {
    if (this.resizeTimer !== undefined)
      clearInterval(this.resizeTimer);
    this.resizeTimer = setTimeout(this._placeAtTop, 200);
  }

  _placeAtTop() {
    console.log("place on top");
    let height = this.notificationTarget.parentNode.offsetHeight;
    let bodyElement = document.querySelector("body");
    bodyElement.style.paddingTop = `${height}px`;
  }

  dismiss() {
    const notificationId = this._getNotificationId();
    if (notificationId) {
      localStorage.setItem(notificationId, 1);
    }
    this.notificationTarget.classList.remove("notification-bar--visible");
    if (this.isSticky) {
      let bodyElement = document.querySelector("body");
      bodyElement.style.paddingTop = "0px";
    }
  }
}
