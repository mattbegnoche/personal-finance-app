/** A savings pot the user is putting money aside in. */
export interface Pot {
  readonly id: string;
  readonly name: string;
  /** Amount saved so far. */
  readonly total: number;
  /** Amount the user is saving towards. */
  readonly target: number;
  /** Hex color used for the pot across bars and legends. */
  readonly theme: string;
}
