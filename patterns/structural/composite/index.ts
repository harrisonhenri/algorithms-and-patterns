/**
 * Allows composing objects into a tree-like structure and work with the it as if it was a singular object.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

abstract class BaseComponent {
  protected parent!: BaseComponent | null;

  public setParent(parent: BaseComponent | null) {
    this.parent = parent;
  }

  public getParent(): BaseComponent | null {
    return this.parent;
  }

  public add(component: BaseComponent): void {}

  public remove(component: BaseComponent): void {}

  public isComposite(): boolean {
    return false;
  }

  public abstract operation(): string;
}

class Leaf extends BaseComponent {
  public operation(): string {
    return "Leaf";
  }
}

class Composite extends BaseComponent {
  protected children: BaseComponent[] = [];

  public add(component: BaseComponent): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: BaseComponent): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);

    component.setParent(null);
  }

  public isComposite(): boolean {
    return true;
  }

  public operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }

    return `Branch(${results.join("+")})`;
  }
}

(() => {
  const tree = new Composite();
  const branch1 = new Composite();
  branch1.add(new Leaf());
  branch1.add(new Leaf());
  const branch2 = new Composite();
  branch2.add(new Leaf());
  tree.add(branch1);
  tree.add(branch2);
  console.log("Client: Now I've got a composite tree:");
  console.log(`RESULT: ${tree.operation()}`);
})();
