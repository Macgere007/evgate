import { DateTime } from "luxon";
import { ICurrent, current } from "./current.types";
import { Energy } from "./energy.types";
import { energy } from "./energyactive.types";
import { leakage } from "./leakage.types";
import { over_current } from "./over_current.types";
import { Power } from "./power.types";
import { power_factor } from "./powerfactor.types";
import { Temperature } from "./temp.types";
import { total_harmonic_of_current } from "./thdi.types";
import { IVoltage, voltage } from "./voltage.types";

export interface IDataAnalitic{
  volt?: IVoltage;
  thdi?: total_harmonic_of_current;
  curr?: ICurrent;
  ocurr?: over_current;
  energyAcRe?: energy;
  temp?: Temperature;
  leak?: leakage;
  power?: Power;
  powerf?: power_factor;
  ev_energy?: IDataPoin[];
}

export interface IDataPoin{
  length?: number;
  x: DateTime;
  y: number | null;
}