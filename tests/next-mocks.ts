import { vi } from "vitest";

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

let mockPathname = "/";

export function getMockPathname() {
  return mockPathname;
}

export function setMockPathname(pathname: string) {
  mockPathname = pathname;
}

export function resetNextMocks() {
  mockPathname = "/";
  mockRouter.push.mockReset();
  mockRouter.replace.mockReset();
  mockRouter.refresh.mockReset();
  mockRouter.prefetch.mockReset();
  mockRouter.back.mockReset();
  mockRouter.forward.mockReset();
}