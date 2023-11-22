import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'object-show-component',
  templateUrl: './object-show.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'objectShow',
  animations   : fuseAnimations
})

export class ObjectShowComponent implements OnInit {
  
  @Input() public data: any = {} 
  @Input() public style: string = 'p-3 sm:p-5 sm:grid-cols-2 md:grid-cols-3'
  

  constructor() { }

  ngOnInit() {}

  getObjectKeys() {
    const element = document.getElementById('checkstyle');
    const computedStyle = window.getComputedStyle(element);
    const gridColsValue = computedStyle.getPropertyValue('grid');
    const cols = gridColsValue.split(' / ')[1].split(' ').length;
    const filteredKeys = Object.keys(this.data).filter(item => !item.includes('Decimal') && !item.includes('Type'));
    while (filteredKeys.length % cols) {
      filteredKeys.push('');
      this.data[''] = '';
    }
    const rows = Math.ceil(filteredKeys.length / cols);
    const newArr = [];
    for (let i = 0; i < filteredKeys.length; i++) {
      const rowsNow = Math.floor(i / cols);
      const colsNow = i % cols;
      newArr.push(filteredKeys[rowsNow + rows * colsNow]);
    }
    return newArr;
  }

  getKeyName(key) {
    let threepase = (this.data.power_s !== undefined)
    let keys = {
      "customerid": "Evgate Id",
      "phase_terminal_temperature": threepase ?  'Temperature R' : 'Temperature',
      "phase_terminal_temperature2": 'Temperature S',
      "phase_terminal_temperature3": 'Temperature T',
      "terminal_temperature_n": 'Temperature N',
      "MCU_temperature": 'Temperature MCU',
      "energy": 'Energy',
      "energy_akumulatif": 'Stand Meter',
      "energy_akumulatif_r": 'Stand Meter R',
      "energy_akumulatif_s": 'Stand Meter S',
      "energy_akumulatif_t": 'Stand Meter T',
      "energy_reactive": 'Reactive Energy',
      "power": 'Power',
      "power_r": 'Power R',
      "power_s": 'Power S',
      "power_t": 'Power T',
      "reactive_power": 'Reactive Power',
      "apparent_power": 'Apparent Power',
      "power_factor": 'Power Factor',
      "current": threepase ? 'Current R': 'Current',
      "current2": 'Current S',
      "current3": 'Current T',
      "current_n": 'Current N',
      "voltage": threepase ? 'Voltage R' : 'Voltage',
      "voltage2": 'Voltage S',
      "voltage3": 'Voltage T',
      "leakage_event_current_value": 'Leakage Event',
      "leakage_current_value": 'Leakage',
      "total_harmonic_of_current": threepase ? 'THDI R' : 'THDI',
      "total_harmonic_of_current2": 'THDI S',
      "total_harmonic_of_current3": 'THDI T',
      "over_current": 'Over Curent',
    }
    return keys[key] ? keys[key] : key
  }

  getUnit(key) {
    return (
      key.includes('total_harmonic') ? '' : 
      key.includes('apparent_power') ? 'kVa' : 
      key.includes('reactive_power') ? 'kVaR' :
      key.includes('power_factor') ? 'λ' : 
      key.includes('temperature') ? 'C' : 
      key.includes('power') ? 'kW' : 
      key.includes('voltage') ? 'V' : 
      key.includes('current') ? 'A' : 
      key.includes('signal') ? 'dBm' :
      key.includes('energy') ? 'kWh' : ''
    )
     return ''
  }
}