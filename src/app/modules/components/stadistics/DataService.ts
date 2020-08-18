import { Subject } from "rxjs";

export class DataService {
  private data = [];
  public getChartDataEvent = new Subject<any>();

  public getChartData() {
    const self = this;

    self.data = [10, 12, 9, 18, 7];

    setTimeout(() => {
      self.getChartDataEvent.next(self.data);
    }, 2000);
  }
}