import { Show, createEffect, createSignal, on } from 'solid-js';

interface Props {
  source: string;
  loading?: boolean;
}

export default function Image(props: Props) {
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);

  createEffect(
    on(
      () => props.source,
      () => {
        setLoading(true);
      }
    )
  );

  const hide = () => props.loading || loading();

  return (
    <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
      <img
        src={props.source}
        onLoad={() => setLoading(false)}
        alt="image"
        classList={{ 'opacity-10': hide() }}
        class="transition-opacity"
        onError={() => setError(true)}
      />
    </Show>
  );
}
