/**
 * Specify an implementation skeleton of an algorithm in an abstract class but letting some pendent steps (abstract methods).
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

abstract class BaseSalaryCalculator {
  constructor() {}

  protected calcPrev(salary: number): number {
    throw new Error("Not implemented");
  }
  protected calcPlan(salary: number): number {
    throw new Error("Not implemented");
  }
  protected calcTax(salary: number): number {
    throw new Error("Not implemented");
  }

  public calcSalary(salary: number): number {
    const prev = this.calcPrev(salary);
    const healthy = this.calcPlan(salary);
    const taxes = this.calcTax(salary);
    return salary - prev - healthy - taxes;
  }
}

class AcmeSalary extends BaseSalaryCalculator {
  protected override calcPrev(salary: number) {
    return salary * 0.01;
  }
  protected override calcPlan(salary: number) {
    return salary * 0.05;
  }
  protected override calcTax(salary: number) {
    return salary * 0.01;
  }
}

const acme = new AcmeSalary();
const salary = 5000.0;

console.log(acme.calcSalary(salary));
