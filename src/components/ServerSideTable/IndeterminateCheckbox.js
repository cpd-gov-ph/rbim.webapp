/**
 * https://github.com/dmitrisanzharov/tanstack-yt-react-table-v8/
 */

import React from "react";

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest]);

  return <input type="checkbox" ref={ref} {...rest}></input>;
}

export default IndeterminateCheckbox;
