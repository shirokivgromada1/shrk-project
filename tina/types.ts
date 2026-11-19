// Thin wrapper over TinaCMS's own schema types.
// Previously this file was a copied snapshot of tinacms 1.x types, which broke
// type-checking after upgrading to tinacms 3.x.
import type { Collection, Template, TinaField } from "tinacms";

export type { Collection, Template, TinaField };

/** A collection defined with `fields` (as opposed to `templates`). */
export type FieldCollection = Extract<Collection, { fields?: any }>;
