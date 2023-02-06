import React, { type ComponentType, type ReactNode } from 'react'

import FallbackComponent, {
  type Props as FallbackComponentProps
} from './FallbackComponent'

export type Props = {
  children: Exclude<NonNullable<ReactNode>, string | number | boolean>,
  FallbackComponent: ComponentType<FallbackComponentProps>,
  onError?: (error: Error, stackTrace: string) => void
}

type State = { error: Error | null, info: any }

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, info: "none"}

  static defaultProps: { FallbackComponent: ComponentType<FallbackComponentProps> } = {
    FallbackComponent: FallbackComponent
  }

  static getDerivedStateFromError (error: Error): State {
    return { error, info: "" }
  }

  componentDidCatch (error: Error, info: { componentStack: string }) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info.componentStack)
    }
    this.setState({error: error, info : info.componentStack})
  }

  resetError: () => void = () => {
    this.setState({ error: null })
  }

  render () {
    const { FallbackComponent } = this.props

    return this.state.error
      ? <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      : this.props.children
  }
}

export default ErrorBoundary
