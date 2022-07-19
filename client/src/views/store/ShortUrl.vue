<template>
  <div />
</template>

<script>
export default {
  name: 'ShortUrl',
  created () {
    const query = this.$route.query // queryString
    const categoryId = this.$route.params.categoryId // 매장 ID
    const param = {
      layoutAppGubun: 'HUB'
    }

    // 카테고리 정보 조회
    this.$nsaxios.post('NSmobilePLCategoryInfo', param, data => {
      const matchedCategory = data.msg.find(categoryInfo => categoryInfo.categoryId === categoryId)
      if (matchedCategory) {
        // 특정 닉네임이 존재하면 해당하는 매장으로 이동
        if (matchedCategory.mslotNickName === 'HOME') {
          this.$router.replace({ name: 'storeHome', query })
          return
        } else if (matchedCategory.mslotNickName === 'TINGLIVE') {
          this.$router.replace({ name: 'thinglive', query })
          return
        }

        if (matchedCategory.layoutViewName) {
          // 레이아웃이 존재하면 슬롯 매장으로 이동
          this.$router.replace({
            name: 'slotStore',
            params: {
              categoryId
            },
            query
          })
          return
        }
      }

      // 이외 케이스는 메인으로 이동
      this.$router.replace({ name: 'storeHome', query })
    })
  }
}
</script>
