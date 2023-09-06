// TODO: 目前使用了vuepress-plugin-fulltext-search-improvement，下面的key和id都是yayu的，如果需要换成Algolia，则需要替换并打开注释
// export default ({ router, Vue, isServer }) => {
//   Vue.mixin({
//     mounted() {
//       // 不加 setTimeout 会有报错，但不影响效果
//       setTimeout(() => {
//         try {
//           // TODO
//           docsearch({
//             appId: "xxx",
//             apiKey: "xxx",
//             indexName: "ericyangxd",
//             container: ".search-box",
//             debug: false,
//             insights: true,
//           });
//         } catch (e) {
//           console.log(e);
//         }
//       }, 100);
//     },
//   });
// };
