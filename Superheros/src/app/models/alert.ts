export interface Alert {
  type: string,
  message: string
}

export interface AlertState {
  alert?: Alert;
  isDisplayed: boolean;
}
