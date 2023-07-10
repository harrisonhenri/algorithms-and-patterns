/**
 * Allow an object to change its behavior according to its internal state. So it seems that the object has changed its type, that is, it is a new object of another class.
 *
 * @date 21/06/2023 - 00:01:00
 *
 */

class Package {
  private state?: PackageState;

  setState(state: PackageState): void {
    this.state = state;
  }

  getState(): PackageState | undefined {
    return this.state;
  }
}

interface PackageState {
  next(pkg: Package): void;
  prev(pkg: Package): void;
  printStatus(): void;
}

class OrderedState implements PackageState {
  public next(pkg: Package): void {
    pkg.setState(new DeliveredState());
  }

  public prev(pkg: Package): void {
    console.log("The package is in its root state.");
  }

  public printStatus(): void {
    console.log("Package ordered, not delivered to the office yet.");
  }
}

class DeliveredState implements PackageState {
  public next(pkg: Package): void {
    pkg.setState(new ReceivedState());
  }

  public prev(pkg: Package): void {
    pkg.setState(new OrderedState());
  }

  public printStatus(): void {
    console.log("Package delivered to post office, not received yet.");
  }
}

class ReceivedState implements PackageState {
  public next(pkg: Package): void {
    pkg.setState(new ReceivedState());
  }

  public prev(pkg: Package): void {
    pkg.setState(new DeliveredState());
  }

  public printStatus(): void {
    console.log("Package receveid.");
  }
}

(() => {
  const pack = new Package();
  const packageState = new DeliveredState();
  pack.setState(packageState);
  pack.getState()?.printStatus();
  pack.getState()?.next(pack);
  pack.getState()?.printStatus();
  pack.getState()?.next(pack);
  pack.getState()?.printStatus();
  pack.getState()?.next(pack);
})();
