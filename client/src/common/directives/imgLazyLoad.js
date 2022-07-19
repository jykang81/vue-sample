import Vue from 'vue'

Vue.directive('img-lazy-load', {
  /**
   * binding된 Element에 DOM에 삽입되었을 때 호출
   *
   * @param {Element} rootEl image lazy laoding을 실행할 영역의 최상위 Element
   * @param {Object} binding binding 정보
   */
  inserted (rootEl, binding) {
    const options = {
      root: null, // scroll event를 감시할 element를 설정
      rootMargin: '40% 0px', // rootMargin을 '40% 0px 40% 0px'로 설정
      threshold: 0 // // 타겟 Element가 교차영역에 진입했을 때 observer가 반응함
    }

    // observer 정의
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // 관찰 대상이 교차 상태이면
        if (entry.isIntersecting) {
          const target = entry.target

          // 이미지 로드
          target.setAttribute('src', target.dataset.src)

          // observer 해제
          observer.unobserve(target)
        }
      })
    }, options)

    // 최상위 Element의 자식 img를 찾아 observer 등록
    rootEl.getElementsByTagName('img').forEach(imgEl => {
      intersectionObserver.observe(imgEl)
    })
  }
})
