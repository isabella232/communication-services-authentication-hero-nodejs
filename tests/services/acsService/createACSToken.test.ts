/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { CommunicationIdentityClient } from '@azure/communication-identity';
import * as acsService from '../../../src/services/acsService';
import { mockCommunicationAccessToken, mockAcsUserId } from '../../utils/mockData';

const mockCommunicationIdentityClient = (
  isCreateClientResolved?: boolean,
  isGetTokenResolved?: boolean
): CommunicationIdentityClient => {
  const clientApp: any = {};
  clientApp.constructor = jest.fn().mockReturnValue(clientApp);
  clientApp.getToken = () => {
    if (!isGetTokenResolved) {
      return new Promise((resolve, reject) => reject(null));
    }
    return new Promise((resolve, reject) => resolve(mockCommunicationAccessToken));
  };
  return !isCreateClientResolved ? undefined : (clientApp as CommunicationIdentityClient);
};

let createAuthenticatedClientSpy: jest.SpyInstance;

describe('ACS Service - Create ACS Token: ', () => {
  test('when Authenticated Client fails to be created, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(false));

    let mockError = undefined;
    try {
      await acsService.createACSToken(mockAcsUserId);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when token fails to be retreived, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, false));

    let mockError = undefined;
    let accessToken;
    try {
      accessToken = await acsService.createACSToken(mockAcsUserId);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when all succeeds, it should return an access token.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, true));

    let mockError = undefined;
    let accessToken;
    try {
      accessToken = await acsService.createACSToken(mockAcsUserId);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeFalsy();
    expect(accessToken).toBe(mockCommunicationAccessToken);
  });
});
