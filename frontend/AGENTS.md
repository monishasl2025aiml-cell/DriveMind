<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## DriveMind architecture
- Use dedicated TanStack leaf routes within the shared DriveMind shell so every fleet view is directly addressable.
- Keep the uploaded demo behavior in a shared in-memory React provider; this frontend has no production authentication or persistent backend connection.
- Render the road graph as an interactive SVG based on shared node and edge data so simulation and overview remain consistent.
