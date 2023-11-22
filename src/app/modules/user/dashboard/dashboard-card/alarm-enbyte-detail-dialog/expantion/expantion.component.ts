import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expantion',
  templateUrl: './expantion.component.html',
  styleUrls: []
})
export class ExpantionComponent implements OnInit {
    @Input() data: any;
    @Input() rawData: boolean;
    @Input() title: string = 'Alarm Byte'
    public casuality = false
    public isPanelExpanded = true;

    ngOnInit(): void {
    }

    getObjectKeys() {
      let arr = Object.keys(this.data).filter(value => (this.data[value] === 0 || this.data[value] === 1) && !value.includes('Num') && !value.includes('Breaker') && !value.includes('rev') && !value.includes('Timer'));
      return arr
    }

    convertValue(key, value) {
      let obj = {
        'Fault Open Flag': value ? 'Detect' : 'Not Detected',
        'Flag Of Breaker Control By Remote': value ? 'ON' : 'OFF',
        'Flag Of Leakage Current Occured': value ? 'Leakage Detected' : 'Normal',
        'Lower Voltage': value ? 'Detected' : 'Normal',
        'Over Voltage': value ? 'Detected' : 'Normal',
        'MCU Over Temperature': value ? 'Overheat' : 'Normal',
        'Over Load': value ? 'Over' : 'Normal',
        'System Self-Test Failure': value ? "System Fail" : "Normal",
        'Terminal Over Temperature': value ? 'Overheat Detected' : 'Normal',
        'Three Phase Unbalance': value ? "Unbalance Detected" : 'Normal'
      }
      return (key in obj ? obj[key] : `${value ? 'On': 'Off'}`)
    }

    getColor(key, value) {
      let warning = 'bg-red-500 animate-pulse text-white'
      let save = 'bg-green-500 dark:bg-green-600 text-white'
      let obj = {
        'Flag Of Leakage Current Occured': value ? warning : save,
        'Lower Voltage': value ? warning : save,
        'Over Voltage': value ? warning : save,
        'MCU Over Temperature': value ? warning : save,
        'Over Load': value ? warning : save,
        'System Self-Test Failure': value ? warning : save,
        'Terminal Over Temperature': value ? warning : save,
        'Three Phase Unbalance': value ? warning : save
      }
      return (key in obj ? obj[key] : 'bg-slate-600 text-white') 
    }

}
