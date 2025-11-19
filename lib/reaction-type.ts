// reaction-types.ts
export type ReactionKey = "thumbsup" | "heart" | "fire" | "smile" | "thoughts"


export interface ReactionDefinition {
  emoji: ReactionKey
  label: string
}

export type ReactionMap = Record<ReactionKey, number>
