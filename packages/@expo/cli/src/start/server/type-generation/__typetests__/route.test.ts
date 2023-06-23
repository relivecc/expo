import { expectType, expectError, expectAssignable, expectNotAssignable } from 'tsd-lite';

import {
  Href,
  useGlobalSearchParams,
  useSegments,
  useRouter,
  useSearchParams,
} from './fixtures/basic';

describe('Href - string', () => {
  it('will error on non-urls', () => {
    expectNotAssignable<Href>('should-error');
  });

  it('can accept an absolute url', () => {
    expectAssignable<Href>('/apple');
    expectAssignable<Href>('/banana');
  });

  it('can accept a ANY relative url', () => {
    // We only type-check absolute urls
    expectAssignable<Href>('./not-a-valid-route');
  });

  it('works for dynamic urls', () => {
    /*
     * This reads backwards but does make sense.
     *
     * The Href type accepts a generic parameter of a string.
     * If that string matches a valid dynamic route, then that dynamic route
     * is assignable
     */
    expectAssignable<Href<'/colors/red'>>('/colors/[color]');

    /*
     * This will fail because only that specific route can match
     */
    expectNotAssignable<Href<'/colors/red'>>('/colors/[some other param]');
  });

  it('can accept a any external url', () => {
    // We only type-check absolute urls
    expectAssignable<Href>('http://expo.dev');
  });
});

describe('Href - object', () => {
  /*
   * You need to use as const on these otherwise TSD will type it as pathname: string
   */

  it('will error on non-urls', () => {
    expectNotAssignable<Href>({ pathname: 'should-error' } as const);
  });

  it('can accept an absolute url', () => {
    expectAssignable<Href>({ pathname: '/apple' } as const);
  });

  it('works for dynamic urls', () => {
    expectAssignable<Href>({
      pathname: '/colors/[color]' as const,
      params: {
        color: 'red',
      },
    } as const);
  });

  it('will error if you try and pass params to a route without params', () => {
    expectNotAssignable<Href>({ pathname: '/apple', params: { a: 1 } } as const);
  });

  it('will error if you try and pass incorrect params to a route', () => {
    expectNotAssignable<Href>({
      pathname: '/colors/[color]' as const,
      params: { fruit: 'apple' },
    });
  });
});

describe('useRouter - push', () => {
  const router = useRouter();

  it('can accept a valid Href', () => {
    expectType<void>(router.push('http://expo.dev'));
    expectType<void>(router.push('./'));
    expectType<void>(router.push('/apple'));
    expectType<void>(router.push({ pathname: '/apple' }));
    expectType<void>(router.push('/colors/red'));
    expectType<void>(
      router.push({ pathname: '/colors/[color]', params: { color: 'red' } } as const)
    );
  });
});

describe('useRouter - replace', () => {
  const router = useRouter();

  it('can accept a valid Href', () => {
    expectType<void>(router.replace('http://expo.dev'));
    expectType<void>(router.replace('./'));
    expectType<void>(router.replace('/apple'));
    expectType<void>(router.replace({ pathname: '/apple' }));
    expectType<void>(router.replace('/colors/red'));
    expectType<void>(
      router.replace({ pathname: '/colors/[color]', params: { color: 'red' } } as const)
    );
  });
});

describe('useSearchParams', () => {
  expectType<Record<'color', string>>(useSearchParams<'/colors/[color]'>());
  expectType<Record<'color', string>>(useSearchParams<Record<'color', string>>());
  expectError(useSearchParams<'/invalid'>());
  expectError(useSearchParams<Record<'custom', string>>());
});

describe('useGlobalSearchParams', () => {
  expectType<Record<'color', string>>(useGlobalSearchParams<'/colors/[color]'>());
  expectType<Record<'color', string>>(useGlobalSearchParams<Record<'color', string>>());
  expectError(useGlobalSearchParams<'/invalid'>());
  expectError(useGlobalSearchParams<Record<'custom', string>>());
});

describe('useSegments', () => {
  it('can accept an absolute url', () => {
    expectType<['apple']>(useSegments<'/apple'>());
  });

  it('only accepts valid possible urls', () => {
    expectError(useSegments<'/invalid'>());
  });

  it('can accept an array of segments', () => {
    expectType<['apple']>(useSegments<['apple']>());
  });

  it('only accepts valid possible segments', () => {
    expectError(useSegments<['invalid segment']>());
  });
});
