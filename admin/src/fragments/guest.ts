import { gql } from "@apollo/client";

export const GUEST_FRAGMENT = gql`
  fragment GuestFragment on GuestType {
    id
    name
    email
    tagUid
  }
`;