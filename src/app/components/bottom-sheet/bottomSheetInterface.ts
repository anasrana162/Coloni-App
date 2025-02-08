export interface hook {
  ref: any;
}

export interface bottomSheet {
  Component?: any;
  extraProps?: object | any;
  ref: any;
  backDropHandler: () => void;
}
