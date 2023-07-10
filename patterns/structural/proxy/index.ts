/**
 * Insert an intermediate object called a proxy (that implements the same interfaces as the base object) between a base object and the client.
 * The proxy is also used in: protocols to comunicate with a remore client (stubs), memory allocation, etc.
 *
 * @date 21/06/2023 - 00:01:00
 *
 */

interface ISubject {
  request(): void;
}

class RealSubject implements ISubject {
  public request(): void {
    console.log("RealSubject: Handling request.");
  }
}

class ProxySubject implements ISubject {
  private realSubject: RealSubject;

  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  public request(): void {
    if (this.checkAccess()) {
      this.realSubject.request();
      this.logAccess();
    }
  }

  private checkAccess(): boolean {
    console.log("Proxy: Checking access prior to firing a real request.");

    return true;
  }

  private logAccess(): void {
    console.log("Proxy: Logging the time of request.");
  }
}

(() => {
  const realSubject = new RealSubject();
  const proxy = new ProxySubject(realSubject);

  realSubject.request();
  proxy.request();
})();
