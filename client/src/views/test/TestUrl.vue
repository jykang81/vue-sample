<template>
  <div>
    <table
      class="table"
    >
      <caption>NSmall3.0 URL 목록</caption>
      <tr>
        <th scope="col">
          #
        </th>
        <th scope="col">
          title
        </th>
        <th scope="col">
          path
        </th>
        <th scope="col">
          depth
        </th>
      </tr>
      <tr
        v-for="(item, index) in urlList"
        :key="index"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.path }}</td>
        <td>{{ item.depth }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 라우터 전체 목록을 가진 객체
      routeList: this.$router.options.routes,
      // 페이지 URL 목록
      urlList: []
    }
  },
  mounted () {
    this.makeUrlList()
  },
  methods: {
    /**
     *  라우터 목록을 가지고 URL 목록을 만든다
     */
    makeUrlList () {
      for (let i = 0; i < this.routeList.length; i++) {
        const parents = this.routeList[i]

        // children이 있으면
        if (Object.prototype.hasOwnProperty.call(parents, 'children')) {
          const children = this.routeList[i].children
          for (let i = 0; i < children.length; i++) {
            const childrenPath = `${this.setParentsPath(parents.path)}${this.setMyPath(children[i].path)}`
            // URL 객체
            const urlObject = {
              path: childrenPath
            }
            // meta 데이터가 있으면
            if (Object.prototype.hasOwnProperty.call(children[i], 'meta')) {
              // title이 있으면
              if (Object.prototype.hasOwnProperty.call(children[i].meta, 'title')) {
                urlObject.title = children[i].meta.title
              } else {
                urlObject.title = '-'
              }
              // depth가 있으면
              if (Object.prototype.hasOwnProperty.call(children[i].meta, 'depth')) {
                urlObject.depth = children[i].meta.depth
              } else {
                urlObject.depth = '-'
              }
            }
            // URL 목록에 URL 객체를 추가해줌
            this.urlList.push(urlObject)
          }
        }
      }
    },
    /**
     * 앞에 /가 없을 경우 /를 붙여줌
     * @param {string} path - URL path
     * @returns {string}
     */
    setMyPath (path) {
      return (path).startsWith('/') ? path : `/${path}`
    },
    /**
     * 부모 path가 /일 경우 ''로 변경해줌
     * @param {string} parentsPath - 부모 URL path
     * @returns {string}
     */
    setParentsPath (parentsPath) {
      return `${parentsPath === '/' ? '' : parentsPath}`
    }
  }
}
</script>

<style>
.table {
    margin: 3rem 3rem;
}
.table th, .table td {
    padding: .6rem .6rem .6rem .6rem;
    border-top: .1rem solid #e0e0e0;
    line-height: 2rem;
    letter-spacing: 0;
    font-size: 1.2rem;
    text-align: left;
}
</style>
