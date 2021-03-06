import { BaseApi } from "../base"
import { extendsProfile } from "../profile"
import { ModuleProfile, Api, API } from "../../types"
import { CompilationResult, CompilationFileSources } from "./type"

export interface ICompilerApi extends Api {
  events: {
    compilationFinished: (fileName: string, source: CompilationFileSources, languageVersion: string, data: CompilationResult) => void
  }
  methods: {
    getCompilationResult(): CompilationResult
    compile(fileName: string): void
  }
}

export const compilerProfile: ModuleProfile<ICompilerApi> = {
  name: 'compiler', // Will be removed when extended
  kind: 'compiler',
  events: ['compilationFinished'],
  methods: ['getCompilationResult', 'compile']
}

export abstract class CompilerApi<T extends Api>
  extends BaseApi<T & ICompilerApi>
  implements API<ICompilerApi> {

  constructor(profile: ModuleProfile<T>) {
    const localProfile = extendsProfile(profile, compilerProfile)
    super(localProfile)
  }

  abstract getCompilationResult(): CompilationResult
  abstract compile(fileName: string): void
}
