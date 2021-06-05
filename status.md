### response.status
``` js
100 "continue"
101 "switching protocols"
102 "processing"
200 "ok"
201 "created"
202 "accepted"
203 "non-authoritative information"
204 "no content"
205 "reset content"
206 "partial content"
207 "multi-status"
208 "already reported"
226 "im used"
300 "multiple choices"
301 "moved permanently"
302 "found"
303 "see other"
304 "not modified"
305 "use proxy"
307 "temporary redirect"
308 "permanent redirect"
400 "bad request"         // 错误请求，服务器不理解
401 "unauthorized"        // 无权限, 需要身份验证
402 "payment required"    // 预留
403 "forbidden"           // 禁止访问
404 "not found"           // 页面丢失
405 "method not allowed"  // 方法不被允许
406 "not acceptable"      // 无法使用 请求的内容特性 响应请求的网页
407 "proxy authentication required"  // 需要代理身份验证
408 "request timeout"      //请求超时
409 "conflict"              // 冲突
410 "gone"
411 "length required"
412 "precondition failed"   // 先决条件失败
413 "payload too large"
414 "uri too long"
415 "unsupported media type"
416 "range not satisfiable"
417 "expectation failed"
418 "I'm a teapot"
422 "unprocessable entity"
423 "locked"
424 "failed dependency"
426 "upgrade required"
428 "precondition required"    // 要求先决条件
429 "too many requests"      // 太多请求, 需要限流
431 "request header fields too large"    // 请求头字段太大
500 "internal server error"
501 "not implemented"
502 "bad gateway"
503 "service unavailable"
504 "gateway timeout"
505 "http version not supported"
506 "variant also negotiates"
507 "insufficient storage"
508 "loop detected"
510 "not extended"
511 "network authentication required"
```