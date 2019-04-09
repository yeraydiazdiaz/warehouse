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
import { debounce } from "debounce";

export default class extends Controller {
  static targets = ["password"];

  connect() {
    console.log("mic check", this.passwordTarget);
    this.onInput = debounce(this.onInput, 300);
  }

  onInput() {
    console.log(this.passwordTarget.value);
    this.digestMessage(this.passwordTarget.value).then(
      digest => console.log(this.hexString(digest))
    );
  }

  async digestMessage(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return window.crypto.subtle.digest("SHA-256", data);
  }

  hexString(buffer) {
    const byteArray = new Uint8Array(buffer);

    const hexCodes = [...byteArray].map(value => {
      const hexCode = value.toString(16);
      const paddedHexCode = hexCode.padStart(2, "0");
      return paddedHexCode;
    });

    return hexCodes.join("");
  }

}
