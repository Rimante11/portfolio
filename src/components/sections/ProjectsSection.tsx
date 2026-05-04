"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import projects from "../../data/projects.json";
import styles from "./ProjectsSection.module.css";

type ProjectItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

const ProjectsSection = () => {
  const projectList = projects as ProjectItem[];

  const uniqueProjects = projectList.filter((project, index, allProjects) => {
    return (
      allProjects.findIndex(
        (entry) =>
          entry.name.trim().toLowerCase() ===
          project.name.trim().toLowerCase()
      ) === index
    );
  });

  const getCardSize = (index: number) => {
    // Fixed sizes for exactly 10 projects — tiles a 4-col grid with no gaps (20 cells total):
    // Large(4)+Wide(2)+Normal(1)+Normal(1)+Wide(2)+Wide(2)+Large(4)+Tall(2)+Normal(1)+Normal(1) = 20
    const sizes = [
      styles.projectLarge, // 0: 2×2
      styles.projectWide,  // 1: 2×1
      "",                  // 2: 1×1
      "",                  // 3: 1×1
      styles.projectWide,  // 4: 2×1
      styles.projectWide,  // 5: 2×1
      styles.projectLarge, // 6: 2×2
      styles.projectTall,  // 7: 1×2
      "",                  // 8: 1×1
      "",                  // 9: 1×1
    ];
    return sizes[index] ?? "";
  };

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className={styles.contentSection}>
      <h3 className={styles.sectionTitle}>Projects</h3>

      <div className={styles.projectsGrid}>
        {uniqueProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className={`${styles.projectCardWrapper} ${getCardSize(index)}`}
            initial={{
              y: 150,
              rotate: index % 2 === 0 ? -10 : 10,
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              rotate: 0,
              opacity: 1,
            }}
            transition={{
              delay: index * 0.12,
              type: "spring",
              stiffness: 90,
            }}
            viewport={{ once: true }}
          >
            <div className={styles.projectCardFront}>
              <div className={styles.imageFrame}>
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className={styles.projectImage}
                />
              </div>

              <div className={styles.projectTitle}>
                <span className={styles.projectName}>{project.name}</span>
                <button
                  type="button"
                  className={styles.projectReadMoreLink}
                  onClick={() => setSelectedProject(project)}
                >
                  Read more
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProject ? (
        <div
          className={styles.projectModalOverlay}
          onClick={() => setSelectedProject(null)}
          role="presentation"
        >
          <div
            className={styles.projectModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <div className={styles.projectModalMedia}>
              <Image
                src={selectedProject.image}
                alt={selectedProject.name}
                fill
                className={styles.projectModalImage}
              />
            </div>
            <div className={styles.projectModalDivider} aria-hidden="true" />
            <div className={styles.projectModalContent}>
              <div className={styles.projectModalHeader}>
                <h4 id="project-modal-title" className={styles.projectModalTitle}>
                  {selectedProject.name}
                </h4>
                <button
                  type="button"
                  className={styles.projectModalClose}
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close project details"
                >
                  Close
                </button>
              </div>
              <div className={styles.projectModalBody}>
                <p className={styles.projectModalDescription}>
                  {selectedProject.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProjectsSection;