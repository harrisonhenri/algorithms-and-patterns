/**
 * This pattern defines a one-to-many relationship between subject and observables.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

class Subject {
  private observers: Array<Observer> = [];

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);

    this.observers.splice(index);
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

interface Observer {
  update(s: Subject): void;
}

class Temperatura extends Subject {
  private temp?: number;

  public getTemp(): number | undefined {
    return this.temp;
  }

  public setTemp(temp: number): void {
    this.temp = temp;
    this.notifyObservers();
  }
}

class TermometroCelsius implements Observer {
  public update(s: Subject) {
    const temp = (s as Temperatura).getTemp();
    console.log("Temperatura Celsius: " + temp);
  }
}

const t = new Temperatura();
t.addObserver(new TermometroCelsius());
t.setTemp(100.0);
