<template>
  <section class="artist-comments q-py-lg" :class="mode ? 'bg-dark-4' : 'bg-grey-3'">
    <div class="text-center col-12 q-mt-lg q-mb-none">
      <h6 class="q-mt-xl q-mb-sm" style="letter-spacing: 3px">
        <small class="text-primary">LA OPINIÓN DE NUESTROS CLIENTES</small>
      </h6>
      <h4
        class="q-mt-none text-weight-bolder q-mb-sm"
        :class="mode ? 'text-white' : ''"
        style="letter-spacing: 3px"
      >
        SOBRE ESTE ARTISTA
      </h4>
    </div>

    <div class="row items-center justify-center q-gutter-sm q-mt-lg no-wrap header-controls">
      <div class="btn-group" :class="mode ? 'bg-grey-8' : 'bg-white'">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          type="button"
          class="pill"
          :class="[
            'cursor-pointer non-selectable',
            selectedFilter === option.value
              ? 'pill--active'
              : mode
              ? 'pill--idle-dark'
              : 'pill--idle-light',
          ]"
          @click="selectedFilter = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div
      class="carousel-window q-mx-auto q-mt-lg"
      :class="mode ? 'bg-grey-8' : 'bg-white'"
      @mouseenter="pauseCarousel = true"
      @mouseleave="pauseCarousel = false"
    >
      <button
        type="button"
        class="carousel-arrow carousel-arrow--left"
        :aria-label="'Anterior'"
        @click="stepCarousel(-1)"
      >
        <i class="q-icon notranslate material-icons">chevron_left</i>
      </button>

      <div
        class="carousel-track"
        :class="{ 'carousel-paused': pauseCarousel }"
        :key="trackKey"
        v-show="marqueeItems.length"
        :style="manualOffset"
      >
        <article
          class="comment-card q-pa-md cursor-pointer"
          v-for="(comment, index) in marqueeItems"
          :key="`comment-${comment.id}-${index}`"
          :class="mode ? 'bg-grey-7 text-white' : 'bg-grey-2'"
          @click="openReader(comment)"
        >
          <div class="row items-center no-wrap">
            <div class="reader-photo q-mr-sm">
              <img
                v-if="comment.user && comment.user.image"
                :src="getBackendImageUrl(comment.user && comment.user.image)"
                alt="Foto de usuario"
              />
              <span v-else class="ql-placeholder">♪</span>
            </div>
            <div class="col">
              <div class="text-subtitle2 text-weight-bold ellipsis">
                {{ comment.user ? comment.user.name : "Cliente" }}
              </div>
              <div class="text-caption" style="opacity: 0.75">
                {{ formatDateComment(comment.created_at) }}
              </div>
            </div>
            <q-rating
              :model-value="comment.rating"
              :max="5"
              size="16px"
              readonly
              color="amber"
            />
          </div>
          <p class="comment-body q-mt-sm q-mb-none">
            {{ comment.comment }}
          </p>
        </article>
      </div>

      <button
        type="button"
        class="carousel-arrow carousel-arrow--right"
        :aria-label="'Siguiente'"
        @click="stepCarousel(1)"
      >
        <i class="q-icon notranslate material-icons">chevron_right</i>
      </button>

      <div
        class="absolute-full flex flex-center text-center q-pa-lg"
        :class="mode ? 'text-grey-4' : 'text-grey-6'"
        v-show="!marqueeItems.length"
      >
        <div>
          <q-icon name="chat_bubble_outline" size="48px" />
          <p class="q-mt-sm q-mb-none">
            Aún no hay comentarios para este artista.
          </p>
        </div>
      </div>
    </div>

    <q-dialog v-model="readerDialog">
      <q-card
        class="reader-card"
        :class="mode ? 'bg-grey-8 text-white' : 'bg-white'"
      >
        <q-card-section class="row items-center no-wrap reader-header q-pt-md">
          <div class="reader-photo reader-photo--lg q-mr-sm">
            <img
              v-if="readerComment && readerComment.user && readerComment.user.image"
              :src="getBackendImageUrl(readerComment && readerComment.user && readerComment.user.image)"
              alt="Foto de usuario"
            />
            <span v-else class="ql-placeholder">♪</span>
          </div>
          <div class="col">
            <div class="text-subtitle1 text-weight-bold ellipsis">
              {{ readerComment && readerComment.user ? readerComment.user.name : "Cliente" }}
            </div>
            <div class="text-caption" style="opacity: 0.75">
              {{ readerComment ? formatDateComment(readerComment.created_at) : "" }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="reader-rating text-center">
          <q-rating
            :model-value="readerComment ? readerComment.rating : 0"
            :max="5"
            size="32px"
            readonly
            color="amber"
          />
        </q-card-section>
        <q-card-section class="reader-body flex flex-center">
          <p class="text-body1 text-center q-mb-none reader-text">
            {{ readerComment ? readerComment.comment : "" }}
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import { api } from "boot/axios";
import { formatDate } from "src/utils/formatDate";

const CAROUSEL_CARD_COUNT = 5;
const CARD_WIDTH = 346;

export default {
  name: "ArtistComments",
  props: {
    artistId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      selectedFilter: "todos",
      pauseCarousel: false,
      manualIndex: null,
      manualTimeout: null,
      readerDialog: false,
      readerComment: null,
      filterOptions: [
        { label: "Todos", value: "todos" },
        { label: "Buenos", value: "buenos" },
        { label: "Bajos", value: "bajos" },
      ],
    };
  },
  computed: {
    mode() {
      return this.$q.dark.isActive;
    },
    visibleComments() {
      return this.selectedFilter === "buenos"
        ? this.comments.filter((comment) => comment.rating >= 4)
        : this.selectedFilter === "bajos"
        ? this.comments.filter((comment) => comment.rating <= 3)
        : this.comments;
    },
    baseComments() {
      return this.visibleComments.length ? this.visibleComments : [];
    },
    stepSize() {
      return CARD_WIDTH;
    },
    trackWidth() {
      return this.baseComments.length ? CAROUSEL_CARD_COUNT * CARD_WIDTH : 0;
    },
    windowWidth() {
      return this.$q.screen.lt.md ? 360 : 540;
    },
    manualOffset() {
      return this.manualIndex === null || !this.baseComments.length
        ? null
        : `transform: translateX(-${this.manualIndex}px); animation: none;`;
    },
    trackKey() {
      return `${this.selectedFilter}-${this.visibleComments.length}`;
    },
    marqueeItems() {
      return this.baseComments.length ? this.buildTrack(this.baseComments) : [];
    },
  },
  methods: {
    async init() {
      try {
        const { data } = await api.get(`/api/artist/${this.artistId}/ratings`);
        this.comments = data.data || [];
      } catch (err) {
        this.comments = [];
      }
    },
    getBackendImageUrl(image) {
      const http =
        image && (image.startsWith("http://") || image.startsWith("https://"));
      return http ? image : `${this.$q.config.backendUrl}${image}`;
    },
    formatDateComment(raw) {
      return formatDate(raw);
    },
    buildTrack(base) {
      const list = [];
      let i = 0;
      while (list.length < CAROUSEL_CARD_COUNT) {
        list.push(base[i % base.length]);
        i += 1;
      }
      return [...list, ...list];
    },
    stepCarousel(direction) {
      const isEmpty = !this.baseComments.length;
      const from = this.manualIndex === null ? 0 : this.manualIndex;
      const step = this.stepSize;
      const maxShift = Math.max(0, this.trackWidth - this.windowWidth);
      const next = from + direction * step;
      this.pauseCarousel = isEmpty ? this.pauseCarousel : true;
      this.manualIndex = isEmpty
        ? this.manualIndex
        : from === 0 && direction < 0
        ? maxShift
        : next >= maxShift
        ? 0
        : next;
      isEmpty ? null : this.scheduleResume();
    },
    scheduleResume() {
      this.manualTimeout ? clearTimeout(this.manualTimeout) : null;
      this.manualTimeout = setTimeout(() => {
        this.manualIndex = null;
        this.pauseCarousel = false;
        this.manualTimeout = null;
      }, 3000);
    },
    openReader(comment) {
      this.readerComment = comment;
      this.readerDialog = true;
    },
  },
  watch: {
    artistId() {
      this.manualIndex = null;
      this.pauseCarousel = false;
      this.init();
    },
    selectedFilter() {
      this.manualTimeout ? clearTimeout(this.manualTimeout) : null;
      this.manualTimeout = null;
      this.manualIndex = null;
      this.pauseCarousel = false;
    },
  },
  beforeDestroy() {
    this.manualTimeout ? clearTimeout(this.manualTimeout) : null;
  },
  created() {
    this.init();
  },
};
</script>

<style scoped>
.header-controls {
  flex-shrink: 0;
}
.btn-group {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
}
.pill {
  border: none;
  border-radius: 999px;
  min-width: 62px;
  font-size: 14px;
  line-height: 1;
  padding: 8px 12px;
}
.pill--active {
  background: var(--q-primary);
  color: #ffffff;
}
.pill--idle-light {
  background: transparent;
  color: #616161;
}
.pill--idle-dark {
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
}
.carousel-window {
  position: relative;
  width: calc(100% - 32px);
  max-width: 1120px;
  height: 176px;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
.carousel-track {
  display: flex;
  flex-direction: row;
  animation-name: scrollSideways;
  animation-duration: 32s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.carousel-paused {
  animation-play-state: paused;
}
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(97, 97, 97, 0.7);
  color: #fff;
  transition: background 0.2s, transform 0.2s;
}
.carousel-arrow:hover {
  background: var(--q-primary);
}
.carousel-arrow i {
  font-size: 30px;
}
.carousel-arrow--left {
  left: 12px;
}
.carousel-arrow--right {
  right: 12px;
}
@keyframes scrollSideways {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.comment-card {
  min-width: 330px;
  max-width: 330px;
  height: 152px;
  border-radius: 12px;
  margin: 10px 8px;
  flex-shrink: 0;
}
.comment-body {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.reader-photo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--q-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.reader-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.reader-photo .ql-placeholder {
  font-size: 24px;
  line-height: 1;
}
.reader-photo--lg {
  width: 68px;
  height: 68px;
}
.reader-photo--lg .ql-placeholder {
  font-size: 30px;
}
.reader-card {
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  border-radius: 16px;
}
.reader-header {
  padding: 16px 16px 8px;
}
.reader-rating {
  padding: 8px 16px;
}
.reader-body {
  padding: 16px;
  flex: 1;
}
.reader-text {
  font-size: 1.15rem;
  line-height: 1.6;
  max-width: 600px;
}
</style>
