/*
 * Copyright (c) 2023, Clay Chipps
 * All rights reserved.
 * Licensed under the MIT License.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/MIT
 */

import { Connection, SfError } from '@salesforce/core';
import { InstalledPackages, PackagingSObjects } from '@salesforce/packaging';

type PackageInstallRequest = PackagingSObjects.PackageInstallRequest;

export const PACKAGE_ID_PREFIX = '0Ho';
export const PACKAGE_VERSION_ID_PREFIX = '04t';

export const isPackageId = (inputToEvaluate: string): boolean =>
  inputToEvaluate ? inputToEvaluate.startsWith(PACKAGE_ID_PREFIX) : false;

export const isPackageVersionId = (inputToEvaluate: string): boolean =>
  inputToEvaluate ? inputToEvaluate.startsWith(PACKAGE_VERSION_ID_PREFIX) : false;

export const isPackageVersionInstalled = (
  installedPackages: InstalledPackages[],
  subscriberPackageVersionId: string
): boolean => {
  const matchedPackaged = installedPackages.find(
    (installedPackage) => installedPackage?.SubscriberPackageVersion?.Id === subscriberPackageVersionId
  );

  return matchedPackaged ? true : false;
};

export const reducePackageInstallRequestErrors = (request: PackageInstallRequest): string => {
  let errorMessage = '<empty>';
  const errors = request?.Errors?.errors;
  if (errors?.length) {
    errorMessage = 'Installation errors: ';
    for (let i = 0; i < errors.length; i++) {
      errorMessage += `\n${i + 1}) ${errors[i].message}`;
    }
  }

  return errorMessage;
};

export const resolvePackageVersionId = async (
  packageName: string,
  versionNumber: string,
  branch: string,
  connection: Connection
): Promise<string> => {
  if (isPackageVersionId(packageName)) {
    return packageName;
  }

  if (!isPackageId(packageName)) {
    throw new SfError('The Package2Id provided is not a valid Package2Id');
  }

  // Strip out the "-LATEST" string as it won't be needed in the query.
  const versionWorking = versionNumber.toUpperCase().replace('-LATEST', '').replace('.LATEST', '');

  // Split the remaining "Major.Minor.Patch.BuildNumber" version number out to its individual integers.
  const versionParts = versionWorking.split('.');

  // Assemble the query needed
  let query = 'Select SubscriberPackageVersionId, IsPasswordProtected, IsReleased ';
  query += 'from Package2Version ';
  query += `where Package2Id='${packageName}' and MajorVersion=${versionParts[0]} and IsDeprecated = false   `;

  // If Minor Version isn't set to LATEST, look for the exact Minor Version
  if (versionParts[1]) {
    query += `and MinorVersion=${versionParts[1]} `;
  }

  // If Patch Version isn't set to LATEST, look for the exact Patch Version
  if (versionParts[2]) {
    query += `and PatchVersion=${versionParts[2]} `;
  }

  // If Build Number isn't set to LATEST, look for the exact Package Version
  if (versionParts[3]) {
    query += `and BuildNumber=${versionParts[3]} `;
  }

  // If Branch is specified, use it to filter
  if (branch) {
    query += `and Branch='${branch.trim()}' `;
  } else {
    query += 'and Branch=NULL ';
  }

  // if the query is looking for a "LATEST", "Non-pinned" version, then we need
  //  to sort the result list in such a manner to that the latest version will
  //  be the first record in the result set.
  query += 'ORDER BY MajorVersion DESC, MinorVersion DESC, PatchVersion DESC, BuildNumber DESC LIMIT 1';

  const resultPackageVersionRecord = await connection.tooling.query(query);

  if (resultPackageVersionRecord?.records?.length === 0) {
    throw new SfError(`Unable to find SubscriberPackageVersionId for dependent package ${packageName}`);
  }

  return resultPackageVersionRecord.records[0]['SubscriberPackageVersionId'] as string;
};
