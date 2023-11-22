export interface AlarmByte {
    StatusOfBreaker: string;
    OverVoltage: number;
    LowerVoltage: number;
    OverLoad: number;
    BreakerOpenByOverLoad: number;
    BreakerCloseByTimer: number;
    BreakerOpenByTimer: number;
    FlagOfBreakerControlByRemote: number;
    Num9: number;
    BreakerOpenByLeakageCurrent: number;
    FlagOfLeakageCurrentOccured: number;
    Num12: number;
    TerminalOverTemperature: number;
    BreakerOpenByOverTemperature: number;
    Num15: number;
    Num16: number;
    MCUOverTemperature: number;
    Num18: number;
    Num19: number;
    BreakerOpenByOverTHD: number;
    Num21: number;
    Num22: number;
    FaultOpenFlag: number;
    OpenAndUnlockedFlag: number;
    BreakerOpenByPressKey: number;
    BreakerCloseByPressKey: number;
    ThreePhaseUnbalance: number;
    PhaseLostOnlyThreePhase: number;
    SystemSelfTestFailure: number;
    LockedFlag: number;
    ProtocolVersion: string;
    Type: string;
  }
  
 export interface ENByte {
    OverVoltageEventEnable: number;
    LowerVoltageEventEnable: number;
    Timer1: number;
    Timer2: number;
    Timer3: number;
    Timer4: number;
    Timer5: number;
    OverLoadEventEnable: number;
    OverCurrent: number;
    TerminalOverTemperatureDetectEnable: number;
    TerminalOverTemperatureBreakerOpen: number;
    Timer6: number;
    Timer7: number;
    Timer8: number;
    Num15: number;
    Num16: number;
    LeakageCurrentDetectEnable: number;
    LeakageCurrentActionEnableOPEN: number;
    Rev1: number;
    Rev2: number;
    Rev3: number;
    Rev4: number;
    LockModeSetting: string;
    Num24: number;
    Num25: number;
    Num26: number;
    ThreePhaseUnbalanceEvent: number;
    PhaseLostOnlyThreePhase: number;
    RemoteLocked: number;
    Num30: number;
    Num31: number;
    Num32: number;
  }

  export interface Alarm {
    ["decimal ALARM BYTE to binary"]: string;
    ["ALARM BYTE"]: AlarmByte;
   ["decimal ENBYTE to binary"]: string;
    ["ENBYTE"]: ENByte;
  }

  