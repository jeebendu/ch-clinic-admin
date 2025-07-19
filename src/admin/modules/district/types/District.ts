
import { State } from "../../state/types/State";

export interface District {
  id: number;
  name: string;
  code: string;
  state: State;
  stateId: number;
}
