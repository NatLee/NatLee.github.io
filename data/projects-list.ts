// Ordered list of all projects. Display order = array order.
//
// To ADD a project: create assets/data/projects/<id>.json, then add an import
// line and an array entry here (position controls display order).
// To DELETE a project: remove its file, import line, and array entry.
import type { ProjectDetail } from './projects'

import p00_power_trading_ai from '@/assets/data/projects/power-trading-ai.json'
import p01_solar_prediction_system from '@/assets/data/projects/solar-prediction-system.json'
import p02_sentiment_analysis_platform from '@/assets/data/projects/sentiment-analysis-platform.json'
import p03_telepy from '@/assets/data/projects/telepy.json'
import p04_django_project_template from '@/assets/data/projects/django-project-template.json'
import p05_django_docker_gui from '@/assets/data/projects/django-docker-gui.json'
import p06_dev_dock_manager from '@/assets/data/projects/dev-dock-manager.json'
import p07_dev_dock_manager_rust from '@/assets/data/projects/dev-dock-manager-rust.json'
import p08_blur_generator from '@/assets/data/projects/blur-generator.json'
import p09_openpose_detect_hands_with_heatmap from '@/assets/data/projects/openpose-detect-hands-with-heatmap.json'
import p10_simply_blur_detector from '@/assets/data/projects/simply-blur-detector.json'
import p11_gura_gru_unit_for_recognizing_affect from '@/assets/data/projects/gura-gru-unit-for-recognizing-affect.json'
import p12_simply_nlp_classification_labeling_platform from '@/assets/data/projects/simply-nlp-classification-labeling-platform.json'
import p13_play_qwop_by_using_ai_agent from '@/assets/data/projects/play-qwop-by-using-ai-agent.json'
import p14_elysion_calendar from '@/assets/data/projects/elysion-calendar.json'
import p15_ssh_reverse_tunnel_using_docker from '@/assets/data/projects/ssh-reverse-tunnel-using-docker.json'
import p16_django_allauth_jwt_template from '@/assets/data/projects/django-allauth-jwt-template.json'
import p17_nipype_preprocess_on_brain_mr from '@/assets/data/projects/nipype-preprocess-on-brain-mr.json'
import p18_dev_dock from '@/assets/data/projects/dev-dock.json'
import p19_heic2png from '@/assets/data/projects/heic2png.json'
import p20_ip_find_chrome_extension from '@/assets/data/projects/ip-find-chrome-extension.json'
import p21_fisheye_warping from '@/assets/data/projects/fisheye-warping.json'
import p22_batch_crop_images from '@/assets/data/projects/batch-crop-images.json'
import p23_myanimelist_comment_crawler from '@/assets/data/projects/myanimelist-comment-crawler.json'
import p24_simply_labeling_platform_for_machine_reading from '@/assets/data/projects/simply-labeling-platform-for-machine-reading.json'
import p25_yande_and_konachan_to_eagle from '@/assets/data/projects/yande-and-konachan-to-eagle.json'
import p26_eagle_wrapper from '@/assets/data/projects/eagle-wrapper.json'
import p27_youtube_video_redirector from '@/assets/data/projects/youtube-video-redirector.json'
import p28_youtube_redirect_player from '@/assets/data/projects/youtube-redirect-player.json'
import p29_pyppesnap from '@/assets/data/projects/pyppesnap.json'
import p30_face_wall_generator_tool from '@/assets/data/projects/face-wall-generator-tool.json'
import p31_image_annotation from '@/assets/data/projects/image-annotation.json'
import p32_obsidian_attachmenter from '@/assets/data/projects/obsidian-attachmenter.json'
import p33_natlee_github_io_v0 from '@/assets/data/projects/natlee.github.io.v0.json'
import p34_natlee_github_io_v1 from '@/assets/data/projects/natlee.github.io.v1.json'
import p35_natlee_github_io_v3 from '@/assets/data/projects/natlee.github.io.v3.json'
import p36_stock_trading_simulation from '@/assets/data/projects/stock-trading-simulation.json'

// Raw JSON shape: same as ProjectDetail but 'links' is optional (added/merged in projects.ts).
type ProjectJson = Omit<ProjectDetail, 'links'> & { links?: ProjectDetail['links'] }

export const projectsJsonData = [
  p00_power_trading_ai,
  p01_solar_prediction_system,
  p02_sentiment_analysis_platform,
  p03_telepy,
  p04_django_project_template,
  p05_django_docker_gui,
  p06_dev_dock_manager,
  p07_dev_dock_manager_rust,
  p08_blur_generator,
  p09_openpose_detect_hands_with_heatmap,
  p10_simply_blur_detector,
  p11_gura_gru_unit_for_recognizing_affect,
  p12_simply_nlp_classification_labeling_platform,
  p13_play_qwop_by_using_ai_agent,
  p14_elysion_calendar,
  p15_ssh_reverse_tunnel_using_docker,
  p16_django_allauth_jwt_template,
  p17_nipype_preprocess_on_brain_mr,
  p18_dev_dock,
  p19_heic2png,
  p20_ip_find_chrome_extension,
  p21_fisheye_warping,
  p22_batch_crop_images,
  p23_myanimelist_comment_crawler,
  p24_simply_labeling_platform_for_machine_reading,
  p25_yande_and_konachan_to_eagle,
  p26_eagle_wrapper,
  p27_youtube_video_redirector,
  p28_youtube_redirect_player,
  p29_pyppesnap,
  p30_face_wall_generator_tool,
  p31_image_annotation,
  p32_obsidian_attachmenter,
  p33_natlee_github_io_v0,
  p34_natlee_github_io_v1,
  p35_natlee_github_io_v3,
  p36_stock_trading_simulation,
] as unknown as ProjectJson[]
