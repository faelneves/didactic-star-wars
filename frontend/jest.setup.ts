import { TextEncoder, TextDecoder } from 'text-encoding';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;