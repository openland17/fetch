import type { Dog } from "@/types";

const PHOTO = (id: number) => `https://placedog.net/200/200?id=${id}`;

export const MY_DOG: Dog = {
  id: "cooper",
  name: "Cooper",
  breed: "Golden Retriever",
  colour: "Gold",
  photoUrl: PHOTO(1),
  tagId: "FETCH-A7F2",
  isOwnDog: true,
};

export const DOGS: Dog[] = [
  MY_DOG,
  {
    id: "bella",
    name: "Bella",
    breed: "Golden Retriever",
    colour: "Gold",
    photoUrl: PHOTO(2),
    tagId: null,
  },
  {
    id: "luna",
    name: "Luna",
    breed: "Border Collie",
    colour: "Black & White",
    photoUrl: PHOTO(3),
    tagId: null,
  },
  {
    id: "rex",
    name: "Rex",
    breed: "Staffy",
    colour: "Brindle",
    photoUrl: PHOTO(4),
    tagId: null,
  },
  {
    id: "milo",
    name: "Milo",
    breed: "Cavoodle",
    colour: "Cream",
    photoUrl: PHOTO(5),
    tagId: null,
  },
  {
    id: "scout",
    name: "Scout",
    breed: "Labrador",
    colour: "Chocolate",
    photoUrl: PHOTO(6),
    tagId: null,
  },
  {
    id: "rosie",
    name: "Rosie",
    breed: "Beagle",
    colour: "Tri-colour",
    photoUrl: PHOTO(7),
    tagId: null,
  },
  {
    id: "ziggy",
    name: "Ziggy",
    breed: "Kelpie",
    colour: "Red",
    photoUrl: PHOTO(8),
    tagId: null,
  },
  {
    id: "charlie",
    name: "Charlie",
    breed: "French Bulldog",
    colour: "Fawn",
    photoUrl: PHOTO(9),
    tagId: null,
  },
  {
    id: "daisy",
    name: "Daisy",
    breed: "Greyhound",
    colour: "Grey",
    photoUrl: PHOTO(10),
    tagId: null,
  },
  {
    id: "hugo",
    name: "Hugo",
    breed: "German Shepherd",
    colour: "Black & Tan",
    photoUrl: PHOTO(11),
    tagId: null,
  },
  {
    id: "coco",
    name: "Coco",
    breed: "Poodle",
    colour: "Apricot",
    photoUrl: PHOTO(12),
    tagId: null,
  },
  {
    id: "archie",
    name: "Archie",
    breed: "Jack Russell",
    colour: "White & Brown",
    photoUrl: PHOTO(13),
    tagId: null,
  },
  {
    id: "pepper",
    name: "Pepper",
    breed: "Dachshund",
    colour: "Black",
    photoUrl: PHOTO(14),
    tagId: null,
  },
  {
    id: "frankie",
    name: "Frankie",
    breed: "Boxer",
    colour: "Brindle",
    photoUrl: PHOTO(15),
    tagId: null,
  },
  {
    id: "willow",
    name: "Willow",
    breed: "Maltese",
    colour: "White",
    photoUrl: PHOTO(16),
    tagId: null,
  },
];

const byId = new Map(DOGS.map((d) => [d.id, d]));

export function getDogById(id: string): Dog | undefined {
  return byId.get(id);
}

export function getDogsByIds(ids: string[]): Dog[] {
  return ids.map((id) => byId.get(id)).filter(Boolean) as Dog[];
}
