

function errorMiddleware(
    error,
    req,
    res,
    // eslint-disable-next-line no-unused-vars
    next
) {
    const status = error.status || 400;
    const message = error.message;

    res.status(status).json({
        query: null,
        error: message,
        result: null,
    });
}

export default errorMiddleware;
