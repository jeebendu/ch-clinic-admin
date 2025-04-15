
export interface FileType {
  id: string;
  name: string;
  type: "file" | "folder";
  modified: string;
  owner: string;
  size: string;
}
