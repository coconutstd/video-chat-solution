// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import DefaultBrowserBehavior from '../browserbehavior/DefaultBrowserBehavior';
import VERSION from './version';

export default class Versioning {
  static X_AMZN_VERSION = 'X-Amzn-Version';
  static X_AMZN_USER_AGENT = 'X-Amzn-User-Agent';

  /**
   * Return string representation of SDK name
   */
  static get sdkName(): string {
    return 'amazon-chime-sdk-js';
  }

  /**
   * Return string representation of SDK version
   */
  static get sdkVersion(): string {
    return VERSION.semverString;
  }

  /**
   * Return the SHA-1 of the Git commit from which this build was created.
   */
  static get buildSHA(): string {
    // Skip the leading 'g'.
    return VERSION.hash.substr(1);
  }

  /**
   * Return low-resolution string representation of SDK user agent (e.g. `chrome-78`)
   */
  static get sdkUserAgentLowResolution(): string {
    const browserBehavior = new DefaultBrowserBehavior();
    return `${browserBehavior.name()}-${browserBehavior.majorVersion()}`;
  }

  /**
   * Return URL with versioning information appended
   */
  static urlWithVersion(url: string): string {
    const urlWithVersion = new URL(url);
    urlWithVersion.searchParams.append(Versioning.X_AMZN_VERSION, Versioning.sdkVersion);
    urlWithVersion.searchParams.append(
      Versioning.X_AMZN_USER_AGENT,
      Versioning.sdkUserAgentLowResolution
    );
    return urlWithVersion.toString();
  }
}
