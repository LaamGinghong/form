type LodashGet<T, Path extends string> =
  string extends Path ? never :
    Path extends keyof T ? T[Path] :
      Path extends `${infer K}.${infer R}` ? K extends keyof T ? LodashGet<T[K], R> :
          never :
        Path extends `${infer K}[${infer I}]` ? K extends keyof T ? T[K] extends any[] ? LodashGet<T[K], I> : never : never : never
