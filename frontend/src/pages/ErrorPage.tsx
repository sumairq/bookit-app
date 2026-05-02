import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

interface Props {
  message?: string;
}

export default function ErrorPage({ message }: Props) {
  const routeError = useRouteError();

  let msg = message;
  let code = "404";
  if (!msg) {
    if (isRouteErrorResponse(routeError)) {
      msg = routeError.statusText || "Something went wrong.";
      code = String(routeError.status ?? "404");
    } else if (routeError instanceof Error) {
      msg = routeError.message;
      code = "500";
    } else {
      msg = "We couldn't find the page you were looking for.";
    }
  }

  return (
    <main className="err">
      <div className="err__inner">
        <div className="err__compass" aria-hidden="true">
          <span>N</span>
        </div>

        <span className="eyebrow eyebrow--ember">Off the map</span>

        <h1 className="err__num">{code}</h1>

        <h2 className="err__title">
          You've wandered <em>off-trail</em>.
        </h2>

        <p className="err__msg">{msg}</p>

        <div className="err__actions">
          <Link to="/" className="btn btn--ember btn--lg">
            Back to base camp
            <span aria-hidden="true">↗</span>
          </Link>
          <Link to="/" className="btn btn--ghost btn--lg">
            Browse experiences
          </Link>
        </div>
      </div>
    </main>
  );
}
